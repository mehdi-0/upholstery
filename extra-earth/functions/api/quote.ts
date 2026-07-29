interface Env {
  QUOTE_WEBHOOK_URL?: string;
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);
const maxPhotoSize = 8 * 1024 * 1024;
const maxRequestSize = 26 * 1024 * 1024;
const maxLengths = { name: 100, email: 254, phone: 30, city: 100, item: 160, message: 3000 } as const;

const hasValidImageSignature = async (photo: File) => {
  const bytes = new Uint8Array(await photo.slice(0, 16).arrayBuffer());
  if (photo.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (photo.type === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  if (photo.type === 'image/webp') return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (photo.type === 'image/heic') {
    const box = String.fromCharCode(...bytes.slice(4, 12));
    return box.startsWith('ftyp') && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(box.slice(4));
  }
  return false;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxRequestSize) {
    return Response.json({ error: 'The upload is too large. Choose up to three photos under 8 MB each.' }, { status: 413 });
  }

  const form = await request.formData();

  // Quietly accept bot submissions caught by the hidden field.
  if (String(form.get('website') || '').trim()) {
    return Response.redirect(new URL('/contact?sent=1', request.url), 303);
  }

  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const city = String(form.get('city') || '').trim();
  const item = String(form.get('item') || '').trim();
  const message = String(form.get('message') || '').trim();
  const fields = { name, email, phone, city, item, message };
  if (Object.values(fields).some((value) => !value)) {
    return Response.json({ error: 'Please complete every field.' }, { status: 400 });
  }
  if (Object.entries(fields).some(([key, value]) => value.length > maxLengths[key as keyof typeof maxLengths])) {
    return Response.json({ error: 'One or more fields are longer than allowed.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+()\d\s.-]{7,30}$/.test(phone)) {
    return Response.json({ error: 'Enter a valid email address and phone number.' }, { status: 400 });
  }

  const photos = form.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0);
  if (photos.length > 3 || photos.some((photo) => photo.size > maxPhotoSize || !allowedImageTypes.has(photo.type))) {
    return Response.json({ error: 'Upload up to 3 supported photos, each under 8 MB.' }, { status: 400 });
  }
  if ((await Promise.all(photos.map(hasValidImageSignature))).some((valid) => !valid)) {
    return Response.json({ error: 'One or more files do not appear to be valid JPG, PNG, WebP or HEIC images.' }, { status: 400 });
  }

  if (!env.QUOTE_WEBHOOK_URL) {
    return Response.json({ error: 'The estimate form is not connected yet. Please call or email us instead.' }, { status: 503 });
  }

  form.delete('website');
  const upstream = await fetch(env.QUOTE_WEBHOOK_URL, { method: 'POST', body: form });
  if (!upstream.ok) return Response.json({ error: 'We could not send your request. Please try again or call us.' }, { status: 502 });

  return Response.redirect(new URL('/contact?sent=1', request.url), 303);
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  return onRequestPost(context);
};
