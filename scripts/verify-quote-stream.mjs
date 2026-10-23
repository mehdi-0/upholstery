import assert from 'node:assert/strict';
import path from 'node:path';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: false,
  cacheDir: path.join(process.env.TMPDIR ?? '/private/tmp', 'nora-quote-vite-cache'),
  logLevel: 'error',
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
const originalFetch = globalThis.fetch;
const originalArrayBuffer = Blob.prototype.arrayBuffer;
const env = {
  TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 'test-key',
  QUOTE_TO_EMAIL: 'owner@example.com', QUOTE_FROM_EMAIL: 'test@example.com',
};

function photo(size) {
  const bytes = Uint8Array.from({ length: size }, (_, index) => index % 256);
  bytes.set([0xff, 0xd8, 0xff]);
  return bytes;
}

function request(photos) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: 'Test "Customer" É', email: 'test@example.com', phone: '6475550100',
    city: 'Richmond Hill', item: 'Dining chairs', message: 'Line one\nLine two <test>',
    'cf-turnstile-response': 'test-token',
  })) form.set(key, value);
  for (const bytes of photos) form.append('photos', new File([bytes], 'visitor.jpg', { type: 'image/jpeg' }));
  return new Request('https://norasupholstery.ca/api/quote', {
    method: 'POST', headers: { Accept: 'application/json' }, body: form,
  });
}

try {
  const { onRequestPost } = await vite.ssrLoadModule('/functions/api/quote.ts');
  async function submit(photos, consume) {
    let emailCalls = 0;
    globalThis.fetch = async (url, options) => {
      if (String(url).startsWith('https://challenges.cloudflare.com/')) {
        return Response.json({ success: true, action: 'estimate_request', hostname: 'norasupholstery.ca' });
      }
      assert.equal(url, 'https://api.resend.com/emails');
      emailCalls++;
      assert.ok(options.body instanceof ReadableStream, 'email body must remain a stream');
      assert.equal(options.headers['Content-Type'], 'application/json');
      try {
        await consume(options.body);
      } finally {
        Blob.prototype.arrayBuffer = originalArrayBuffer;
      }
      return Response.json({ id: 'mock-email' });
    };
    const response = await onRequestPost({ request: request(photos), env });
    return { response, emailCalls };
  }

  let largestChunk = 0;
  async function verifyPayload(expected) {
    const result = await submit(expected, async (stream) => {
      Blob.prototype.arrayBuffer = function () {
        assert.ok(this.size <= 24 * 1024, 'encoding must never read a whole large file');
        return originalArrayBuffer.call(this);
      };
      const reader = stream.getReader();
      const chunks = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        largestChunk = Math.max(largestChunk, value.byteLength);
        assert.ok(value.byteLength <= 64 * 1024, 'outgoing chunks must stay small');
        chunks.push(value);
      }
      // Only the test receiver aggregates JSON. The endpoint must not do this.
      const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      assert.equal(payload.subject, 'New upholstery request from Test "Customer" É');
      assert.match(payload.html, /&lt;test&gt;/);
      assert.equal(payload.attachments.length, expected.length);
      for (const [index, attachment] of payload.attachments.entries()) {
        assert.equal(attachment.filename, `project-photo-${index + 1}.jpg`);
        assert.equal(attachment.content_type, 'image/jpeg');
        assert.equal(attachment.content, Buffer.from(expected[index]).toString('base64'), 'Base64 must match across chunk and padding boundaries');
        assert.equal(attachment.photo, undefined, 'internal File objects must not enter JSON');
      }
    });
    assert.equal(result.response.status, 200);
    assert.equal(result.emailCalls, 1);
  }

  await verifyPayload([]);
  for (const size of [3, 4, 5, 24575, 24576, 24577, 49151]) await verifyPayload([photo(size)]);
  await verifyPayload(Array.from({ length: 5 }, () => photo(5 * 1024 * 1024)));

  const canceled = await submit([photo(100000)], async (stream) => {
    let reads = 0;
    Blob.prototype.arrayBuffer = function () {
      reads++;
      return originalArrayBuffer.call(this);
    };
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(reads, 0, 'no encoding before the receiver pulls');
    const reader = stream.getReader();
    await reader.read(); // Message metadata.
    await reader.read(); // First attachment metadata.
    await reader.cancel('receiver disconnected');
    assert.equal(reads, 0, 'cancellation must stop before reading photo content');
    throw new Error('Simulated failed delivery');
  });
  assert.equal(canceled.response.status, 502);

  const brokenRead = await submit([photo(100000)], async (stream) => {
    Blob.prototype.arrayBuffer = async () => { throw new Error('Simulated photo read error'); };
    await new Response(stream).text();
  });
  assert.equal(brokenRead.response.status, 502, 'stream failures must return the normal send error');

  for (const invalid of [Array.from({ length: 6 }, () => photo(3)), [photo(5 * 1024 * 1024 + 1)], [new Uint8Array(10)]]) {
    const rejected = await submit(invalid, async () => assert.fail('invalid uploads must not reach Resend'));
    assert.equal(rejected.response.status, 400);
    assert.equal(rejected.emailCalls, 0);
  }
  console.log(`Quote streaming checks passed: exact Base64, five maximum-size photos, bounded reads/chunks (largest ${largestChunk} bytes), backpressure, cancellation, failures and upload validation.`);
} finally {
  globalThis.fetch = originalFetch;
  Blob.prototype.arrayBuffer = originalArrayBuffer;
  await vite.close();
}
