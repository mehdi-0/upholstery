# Cloudflare Pages setup

- Root directory: leave blank (the website is at the repository root)
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22.12.0` or newer (Astro 7 requires Node `^20.19.0` or `>=22.12.0`)
- Package manager: npm (`package-lock.json` is the deployment lockfile)

Cloudflare automatically provides `CF_PAGES_URL` to preview builds. When the final
custom domain is ready, add `PUBLIC_SITE_URL` as a production environment variable
using the full `https://` URL. This lets Astro generate correct absolute metadata and
structured-data URLs without hard-coding the unfinished domain today.

## Estimate form

The form posts to the Cloudflare Pages Function at `functions/api/quote.ts`. Add an encrypted Cloudflare Pages secret named `QUOTE_WEBHOOK_URL` containing the endpoint supplied by your email or form provider. Every text field is required; photos are optional. When photos are supplied, the function enforces a maximum of three files and 8 MB per photo, approved image formats and basic image-file signatures. It also enforces field lengths, email and phone formats and an overall request-size ceiling before forwarding the multipart request. The webhook remains hidden from the browser and repository.

The hidden honeypot reduces simple automated spam. For stronger bot protection after the production domain is connected, add Cloudflare Turnstile and consider a Cloudflare WAF rate-limiting rule for `POST /api/quote`. Browser validation is only for convenience; the Pages Function performs the security checks that matter.

Until this secret is configured, the function deliberately returns a friendly unavailable response instead of silently losing customer requests.

Before testing the form publicly, submit one request with and one without photos and
confirm that both arrive at the configured endpoint. Cloudflare hosts the function,
but `QUOTE_WEBHOOK_URL` is still required to deliver the message.

## Domain and metadata

Preview deployments use `CF_PAGES_URL` for canonical links, social metadata and
structured data. When the custom domain is connected, set `PUBLIC_SITE_URL` to its
full `https://` address and those URLs will update automatically. No page code needs
to change.
