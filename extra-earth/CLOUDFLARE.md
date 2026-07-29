# Cloudflare Pages setup

- Root directory: `extra-earth`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22.12.0` or newer (Astro 7 requires Node `^20.19.0` or `>=22.12.0`)

## Estimate form

The form posts to the Cloudflare Pages Function at `functions/api/quote.ts`. Add an encrypted Cloudflare Pages secret named `QUOTE_WEBHOOK_URL` containing the endpoint supplied by your email or form provider. The function validates required fields, rejects oversized/unsupported photos and forwards the multipart request without exposing the webhook in the browser or repository.

Until this secret is configured, the function deliberately returns a friendly unavailable response instead of silently losing customer requests.

## Domain and metadata

The project intentionally omits canonical and absolute social-image URLs until the production domain is connected. Add those once the final domain is known.
