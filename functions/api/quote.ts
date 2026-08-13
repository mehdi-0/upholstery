interface Env {
  RESEND_API_KEY?: string;
  QUOTE_TO_EMAIL?: string;
  QUOTE_FROM_EMAIL?: string;
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const maxPhotoSize = 8 * 1024 * 1024;
const maxRequestSize = 26 * 1024 * 1024;
const maxLengths = { name: 100, email: 254, phone: 30, city: 100, item: 160, message: 3000 } as const;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}[character] || character));

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};

const hasValidImageSignature = async (photo: File) => {
  const bytes = new Uint8Array(await photo.slice(0, 16).arrayBuffer());
  if (photo.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (photo.type === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  if (photo.type === 'image/webp') return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (photo.type === 'image/heic' || photo.type === 'image/heif') {
    const box = String.fromCharCode(...bytes.slice(4, 12));
    return box.startsWith('ftyp') && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(box.slice(4));
  }
  return false;
};

const wantsJson = (request: Request) => request.headers.get('accept')?.includes('application/json') ?? false;
const responseHeaders = { 'Cache-Control': 'no-store' };
const fail = (request: Request, error: string, code: string, status: number) => {
  if (wantsJson(request)) return Response.json({ error }, { status, headers: responseHeaders });
  const location = new URL('/contact', request.url);
  location.searchParams.set('error', code);
  location.hash = 'estimate-form';
  return Response.redirect(location, 303);
};
const succeed = (request: Request) => {
  if (wantsJson(request)) return Response.json({ ok: true }, { headers: responseHeaders });
  return Response.redirect(new URL('/contact?sent=1#estimate-form', request.url), 303);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxRequestSize) {
    return fail(request, 'The upload is too large. Choose up to three photos under 8 MB each.', 'large', 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(request, 'We could not read this request. Please try again.', 'send', 400);
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
  const fields = { name, email, phone, city, item, message };
  if (Object.values(fields).some((value) => !value)) {
    return fail(request, 'Please complete every required field.', 'missing', 400);
  }
  if (Object.entries(fields).some(([key, value]) => value.length > maxLengths[key as keyof typeof maxLengths])) {
    return fail(request, 'One or more fields are longer than allowed.', 'invalid', 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+()\d\s.-]{7,30}$/.test(phone)) {
    return fail(request, 'Enter a valid email address and phone number.', 'invalid', 400);
  }

  const photos = form.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0);
  if (photos.length > 3 || photos.some((photo) => photo.size > maxPhotoSize || !allowedImageTypes.has(photo.type))) {
    return fail(request, 'Upload up to 3 supported photos, each under 8 MB.', 'files', 400);
  }
  if ((await Promise.all(photos.map(hasValidImageSignature))).some((valid) => !valid)) {
    return fail(request, 'One or more files do not appear to be valid JPG, PNG, WebP, HEIC or HEIF images.', 'files', 400);
  }

  if (!env.RESEND_API_KEY || !env.QUOTE_TO_EMAIL || !env.QUOTE_FROM_EMAIL) {
    return fail(request, 'The contact form is temporarily unavailable. Please call, email or message us on WhatsApp.', 'unavailable', 503);
  }

  try {
    const attachments = await Promise.all(photos.map(async (photo) => ({
      filename: photo.name || 'project-photo',
      content: toBase64(await photo.arrayBuffer()),
    })));
    const safe = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, escapeHtml(value)])) as typeof fields;
    const submittedAt = new Date().toISOString();
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: env.QUOTE_FROM_EMAIL,
        to: [env.QUOTE_TO_EMAIL],
        reply_to: email,
        subject: `New upholstery request from ${name}`,
        html: `
          <h1>New upholstery request</h1>
          <table style="border-collapse:collapse">
            <tr><th style="text-align:left;padding:6px 16px 6px 0">Name</th><td>${safe.name}</td></tr>
            <tr><th style="text-align:left;padding:6px 16px 6px 0">Phone</th><td>${safe.phone}</td></tr>
            <tr><th style="text-align:left;padding:6px 16px 6px 0">Email</th><td>${safe.email}</td></tr>
            <tr><th style="text-align:left;padding:6px 16px 6px 0">City</th><td>${safe.city}</td></tr>
            <tr><th style="text-align:left;padding:6px 16px 6px 0">Item or project</th><td>${safe.item}</td></tr>
          </table>
          <h2>Project details</h2>
          <p style="white-space:pre-wrap">${safe.message}</p>
          <p><small>Submitted ${submittedAt}. ${photos.length} photo${photos.length === 1 ? '' : 's'} attached.</small></p>
        `,
        text: `New upholstery request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nItem or project: ${item}\n\nProject details:\n${message}\n\nSubmitted ${submittedAt}. ${photos.length} photo${photos.length === 1 ? '' : 's'} attached.`,
        attachments,
      }),
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
  if (context.request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  return onRequestPost(context);
};
