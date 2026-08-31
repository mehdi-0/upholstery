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

The form posts to the Cloudflare Pages Function at `functions/api/quote.ts`, which sends the request through Resend. Add encrypted Cloudflare Pages secrets named `RESEND_API_KEY`, `QUOTE_TO_EMAIL` (the inbox that receives requests), `QUOTE_FROM_EMAIL` (a Resend-verified sender address) and `TURNSTILE_SECRET_KEY`. Add `PUBLIC_TURNSTILE_SITE_KEY` as a regular production variable; it is safe to expose in the browser. The referral question and photos are optional; the other text fields are required. When photos are supplied, the function enforces a maximum of five files and 5 MB per photo, approved image formats and basic image-file signatures. It also enforces field lengths, email and phone formats, approved referral choices, Turnstile verification and an overall request-size ceiling before sending the email.

The hidden honeypot reduces simple automated spam, and Turnstile requires each request to carry a valid one-time token. Consider a Cloudflare WAF rate-limiting rule for `POST /api/quote` as an additional safeguard. Browser validation is only for convenience; the Pages Function performs the security checks that matter.

Until this secret is configured, the function deliberately returns a friendly unavailable response instead of silently losing customer requests.

Before testing the form publicly, submit one request with and one without photos and
confirm that both arrive in the inbox configured by `QUOTE_TO_EMAIL`. Cloudflare hosts
the function, and Resend delivers the message.

## Domain and metadata

Preview deployments use `CF_PAGES_URL` for canonical links, social metadata and
structured data. When the custom domain is connected, set `PUBLIC_SITE_URL` to its
full `https://` address and those URLs will update automatically. No page code needs
to change.
