interface Env {
  RESEND_API_KEY?: string;
  QUOTE_TO_EMAIL?: string;
  QUOTE_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const imageExtensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/heic', 'heic'],
  ['image/heif', 'heif'],
]);
const maxPhotoCount = 5;
const maxPhotoSize = 5 * 1024 * 1024;
const maxRequestSize = 28 * 1024 * 1024;
const maxFormEntries = 20;
const maxLengths = { name: 100, email: 254, phone: 30, city: 100, item: 160, message: 3000, referralSource: 100, referralDetail: 160 } as const;
const referralSources = new Set(['Google', 'Instagram', 'Facebook', 'Referral', 'Returning customer', 'ODA or OCA magazine/advertisement', 'Other']);
const referralSourcesWithDetail = new Set(['Referral', 'Other']);
const allowedFormFields = new Set([
  'name', 'email', 'phone', 'city', 'item', 'message', 'referralSource', 'referralDetail',
  'website', 'cf-turnstile-response', 'photos',
]);
const securityHeaders = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
};
type TurnstileVerification = { success: boolean; action?: string; hostname?: string };
type ResendAttachment = { filename: string; content_type: string; photo: File };

const readFormDataWithLimit = async (request: Request) => {
  const contentType = request.headers.get('content-type') || '';
  if (!/^multipart\/form-data\s*;/i.test(contentType)) throw new Error('Expected multipart form data');
  if (!request.body) throw new Error('Missing request body');

  const reader = request.body.getReader();
  let bytesRead = 0;
  let tooLarge = false;
  const boundedBody = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        if (bytesRead + value.byteLength > maxRequestSize) {
          tooLarge = true;
          try {
            await reader.cancel('Request body exceeds the allowed size');
          } catch {
            // The response is rejected below even if cancellation is unavailable.
          }
          controller.error(new Error('Request body exceeds the allowed size'));
          return;
        }
        bytesRead += value.byteLength;
        controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel(reason) {
      await reader.cancel(reason);
    },
  });

  try {
    const body = new Response(boundedBody, { headers: { 'Content-Type': contentType } });
    return { form: await body.formData(), tooLarge: false };
  } catch (error) {
    if (tooLarge) return { form: null, tooLarge: true };
    throw error;
  }
};

const hasExpectedFormShape = (form: FormData) => {
  const seenFields = new Set<string>();
  let entryCount = 0;
  for (const [name, value] of form.entries()) {
    entryCount += 1;
    if (entryCount > maxFormEntries || !allowedFormFields.has(name)) return false;
    if (name === 'photos') {
      if (!(value instanceof File)) return false;
      continue;
    }
    if (value instanceof File || seenFields.has(name)) return false;
    seenFields.add(name);
  }
  return true;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}[character] || character));

// Serialize attachments on demand instead of retaining Base64 strings and a second
// full JSON copy. A multiple of three prevents padding between Base64 chunks.
const createEmailBody = (message: Record<string, unknown>, attachments: ResendAttachment[]) => {
  const encoder = new TextEncoder();
  const chunkSize = 24 * 1024;
  const chunks = (async function* () {
    yield encoder.encode(`${JSON.stringify(message).slice(0, -1)},"attachments":[`);
    for (const [index, attachment] of attachments.entries()) {
      const metadata = JSON.stringify({ filename: attachment.filename, content_type: attachment.content_type });
      yield encoder.encode(`${index ? ',' : ''}${metadata.slice(0, -1)},"content":"`);
      for (let offset = 0; offset < attachment.photo.size; offset += chunkSize) {
        const bytes = new Uint8Array(await attachment.photo.slice(offset, offset + chunkSize).arrayBuffer());
        yield encoder.encode(btoa(String.fromCharCode(...bytes)));
      }
      yield encoder.encode('"}');
    }
    yield encoder.encode(']}');
  })();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await chunks.next();
        if (done) controller.close();
        else controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await chunks.return(undefined);
    },
  }, { highWaterMark: 0 });
};

const hasValidImageSignature = async (photo: File, contentType: string) => {
  const bytes = new Uint8Array(await photo.slice(0, 16).arrayBuffer());
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  if (contentType === 'image/webp') return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (contentType === 'image/heic' || contentType === 'image/heif') {
    const box = String.fromCharCode(...bytes.slice(4, 12));
    return box.startsWith('ftyp') && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(box.slice(4));
  }
  return false;
};

const wantsJson = (request: Request) => request.headers.get('accept')?.includes('application/json') ?? false;
const redirect = (location: URL) => new Response(null, {
  status: 303,
  headers: { ...securityHeaders, Location: location.toString() },
});
const fail = (request: Request, error: string, code: string, status: number) => {
  if (wantsJson(request)) return Response.json({ error }, { status, headers: securityHeaders });
  const location = new URL('/contact', request.url);
  location.searchParams.set('error', code);
  location.hash = 'estimate-form';
  return redirect(location);
};
const succeed = (request: Request) => {
  if (wantsJson(request)) return Response.json({ ok: true }, { headers: securityHeaders });
  return redirect(new URL('/contact?sent=1#estimate-form', request.url));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const contentLengthHeader = request.headers.get('content-length');
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : Number.NaN;
  if (Number.isFinite(contentLength) && contentLength > maxRequestSize) {
    return fail(request, 'The upload is too large. Choose up to five photos under 5 MB each.', 'large', 413);
  }

  let form: FormData;
  try {
    const parsed = await readFormDataWithLimit(request);
    if (parsed.tooLarge) {
      return fail(request, 'The upload is too large. Choose up to five photos under 5 MB each.', 'large', 413);
    }
    if (!parsed.form) throw new Error('Could not read form data');
    form = parsed.form;
  } catch {
    return fail(request, 'We could not read this request. Please try again.', 'send', 400);
  }

  if (!hasExpectedFormShape(form)) {
    return fail(request, 'This request contains unexpected form fields. Please reload the page and try again.', 'invalid', 400);
  }

  // Quietly accept bot submissions caught by the hidden field.
  if (String(form.get('website') || '').trim()) {
    return succeed(request);
  }

  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const city = String(form.get('city') || '').trim();
  const item = String(form.get('item') || '').trim();
  const message = String(form.get('message') || '').trim();
  const referralSource = String(form.get('referralSource') || '').trim();
  const referralDetail = referralSourcesWithDetail.has(referralSource)
    ? String(form.get('referralDetail') || '').trim()
    : '';
  const fields = { name, email, phone, city, item, message, referralSource, referralDetail };
  const requiredFields = { name, email, phone, city, item, message };
  if (Object.values(requiredFields).some((value) => !value)) {
    return fail(request, 'Please complete every required field.', 'missing', 400);
  }
  if (Object.entries(fields).some(([key, value]) => value.length > maxLengths[key as keyof typeof maxLengths])) {
    return fail(request, 'One or more fields are longer than allowed.', 'invalid', 400);
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+()\d\s.-]{7,30}$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return fail(request, 'Enter a valid email address and phone number.', 'invalid', 400);
  }
  if (referralSource && !referralSources.has(referralSource)) {
    return fail(request, 'Choose a valid answer for how you heard about us.', 'invalid', 400);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return fail(request, 'The contact form is temporarily unavailable. Please call, email or message us on WhatsApp.', 'unavailable', 503);
  }
  const turnstileToken = String(form.get('cf-turnstile-response') || '').trim();
  if (!turnstileToken || turnstileToken.length > 2048) {
    return fail(request, 'Please complete the security check and try again.', 'verification', 400);
  }
  try {
    const verificationData = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      idempotency_key: crypto.randomUUID(),
    });
    const visitorIp = request.headers.get('CF-Connecting-IP');
    if (visitorIp) verificationData.set('remoteip', visitorIp);
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationData,
      signal: AbortSignal.timeout(15_000),
    });
    const verification = await verificationResponse.json() as TurnstileVerification;
    const expectedHostname = new URL(request.url).hostname.toLowerCase();
    if (
      !verificationResponse.ok ||
      !verification.success ||
      verification.action !== 'estimate_request' ||
      !verification.hostname ||
      verification.hostname.toLowerCase() !== expectedHostname
    ) {
      return fail(request, 'Please complete the security check and try again.', 'verification', 400);
    }
  } catch {
    return fail(request, 'We could not verify the security check. Please try again in a moment.', 'unavailable', 503);
  }

  const photoValues = form.getAll('photos');
  if (photoValues.length > maxPhotoCount || photoValues.some((value) => !(value instanceof File))) {
    return fail(request, 'Upload up to 5 supported photos, each under 5 MB.', 'files', 400);
  }
  const photos = (photoValues as File[]).filter((photo) => photo.size > 0);
  if (photos.some((photo) => photo.size > maxPhotoSize || !allowedImageTypes.has(photo.type.toLowerCase()))) {
    return fail(request, 'Upload up to 5 supported photos, each under 5 MB.', 'files', 400);
  }
  if ((await Promise.all(photos.map((photo) => hasValidImageSignature(photo, photo.type.toLowerCase())))).some((valid) => !valid)) {
    return fail(request, 'One or more files do not appear to be valid JPG, PNG, WebP, HEIC or HEIF images.', 'files', 400);
  }

  if (!env.RESEND_API_KEY || !env.QUOTE_TO_EMAIL || !env.QUOTE_FROM_EMAIL) {
    return fail(request, 'The contact form is temporarily unavailable. Please call, email or message us on WhatsApp.', 'unavailable', 503);
  }

  try {
    const attachments: ResendAttachment[] = [];
    for (const [index, photo] of photos.entries()) {
      const contentType = photo.type.toLowerCase();
      const extension = imageExtensions.get(contentType);
      if (!extension) return fail(request, 'Upload up to 5 supported photos, each under 5 MB.', 'files', 400);
      attachments.push({
        filename: `project-photo-${index + 1}.${extension}`,
        content_type: contentType,
        photo,
      });
    }
    const safe = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, escapeHtml(value)])) as typeof fields;
    const submittedAt = new Date().toISOString();
    const submittedAtDisplay = new Intl.DateTimeFormat('en-CA', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Toronto',
    }).format(new Date(submittedAt));
    const contactPhoneDigits = phoneDigits.replace(/^1?(\d{10})$/, '1$1');
    const replySubject = encodeURIComponent('Regarding your Nora’s Upholstery estimate request');
    const sourceDetail = safe.referralDetail ? ` — ${safe.referralDetail}` : '';
    const referralRow = safe.referralSource
      ? `<tr><td style="padding:8px 0;color:#6a6258;font-size:13px">How they found us</td><td style="padding:8px 0;color:#102f3d;font-size:14px;font-weight:600;text-align:right">${safe.referralSource}${sourceDetail}</td></tr>`
      : '';
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      signal: AbortSignal.timeout(20_000),
      body: createEmailBody({
        from: env.QUOTE_FROM_EMAIL,
        to: [env.QUOTE_TO_EMAIL],
        reply_to: email,
        subject: `New upholstery request from ${name.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()}`,
        html: `
          <div style="margin:0;padding:32px 16px;background:#f7f3eb;color:#102f3d;font-family:Arial,Helvetica,sans-serif">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;margin:0 auto;border-collapse:separate;border-spacing:0;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(16,47,61,.10)">
              <tr>
                <td style="padding:28px 32px 25px;background:#102f3d;color:#ffffff">
                  <p style="margin:0 0 8px;color:#dfc9a8;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Nora’s Upholstery</p>
                  <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;line-height:1.1">New estimate request</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px 32px 10px">
                  <p style="margin:0 0 4px;color:#6a6258;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">From</p>
                  <h2 style="margin:0;color:#102f3d;font-family:Georgia,'Times New Roman',serif;font-size:27px;font-weight:400;line-height:1.2">${safe.name}</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px 28px">
                  <a href="tel:${contactPhoneDigits}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 15px;border-radius:8px;background:#102f3d;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none">Call ${safe.phone}</a>
                  <a href="mailto:${encodeURIComponent(email)}?subject=${replySubject}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 15px;border:1px solid #cbb28d;border-radius:8px;color:#102f3d;font-size:13px;font-weight:700;text-decoration:none">Reply by email</a>
                  <a href="https://wa.me/${contactPhoneDigits}" style="display:inline-block;margin:0 0 8px;padding:11px 15px;border:1px solid #cbb28d;border-radius:8px;color:#102f3d;font-size:13px;font-weight:700;text-decoration:none">WhatsApp</a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 28px">
                  <div style="padding:19px 20px;border-radius:12px;background:#f7f3eb">
                    <p style="margin:0 0 10px;color:#8c6a43;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Project snapshot</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse">
                      <tr><td style="padding:8px 0;color:#6a6258;font-size:13px">City</td><td style="padding:8px 0;color:#102f3d;font-size:14px;font-weight:600;text-align:right">${safe.city}</td></tr>
                      <tr><td style="padding:8px 0;border-top:1px solid #e7ddce;color:#6a6258;font-size:13px">Project</td><td style="padding:8px 0;border-top:1px solid #e7ddce;color:#102f3d;font-size:14px;font-weight:600;text-align:right">${safe.item}</td></tr>
                      ${referralRow}
                      <tr><td style="padding:8px 0;border-top:1px solid #e7ddce;color:#6a6258;font-size:13px">Photos attached</td><td style="padding:8px 0;border-top:1px solid #e7ddce;color:#102f3d;font-size:14px;font-weight:600;text-align:right">${photos.length}</td></tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 30px">
                  <p style="margin:0 0 10px;color:#8c6a43;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Project details</p>
                  <div style="padding:19px 20px;border-left:3px solid #b78a47;border-radius:0 10px 10px 0;background:#fbf9f5;color:#273d46;font-size:15px;line-height:1.65;white-space:pre-wrap">${safe.message}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 32px;border-top:1px solid #eee7dc;color:#81796f;font-size:12px;line-height:1.5">Received ${submittedAtDisplay} · ${photos.length} photo${photos.length === 1 ? '' : 's'} attached</td>
              </tr>
            </table>
          </div>
        `,
        text: `New upholstery request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nItem or project: ${item}${referralSource ? `\nHow they found us: ${referralSource}${referralDetail ? ` — ${referralDetail}` : ''}` : ''}\n\nProject details:\n${message}\n\nReceived ${submittedAtDisplay}. ${photos.length} photo${photos.length === 1 ? '' : 's'} attached.`,
      }, attachments),
    });
    if (!upstream.ok) {
      console.error('Resend rejected quote request', upstream.status, await upstream.text());
      return fail(request, 'We could not send your request. Please try again or use one of the contact options.', 'send', 502);
    }
  } catch {
    return fail(request, 'We could not send your request. Please try again or use one of the contact options.', 'send', 502);
  }

  return succeed(request);
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...securityHeaders, Allow: 'POST' },
    });
  }
  return onRequestPost(context);
};
