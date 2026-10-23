# Cloudflare Pages setup

- Root directory: leave blank (the website is at the repository root)
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22.12.0` or newer (Astro 7 requires Node `^20.19.0` or `>=22.12.0`)
- Package manager: npm (`package-lock.json` is the deployment lockfile)

The canonical site URL for metadata, structured data, the generated sitemap and the
`robots.txt` sitemap entry is fixed to `https://norasupholstery.ca` in `astro.config.mjs`.
Do not use Cloudflare's `CF_PAGES_URL` as the site origin: it can be a deployment-specific
`pages.dev` URL, which must not appear in public canonical metadata or sitemap URLs.

## Estimate form

The form posts to the Cloudflare Pages Function at `functions/api/quote.ts`, which sends the request through Resend. Add encrypted Cloudflare Pages secrets named `RESEND_API_KEY`, `QUOTE_TO_EMAIL` (the inbox that receives requests), `QUOTE_FROM_EMAIL` (a Resend-verified sender address) and `TURNSTILE_SECRET_KEY`. Add the Turnstile widget's allowed hostnames in its Cloudflare settings: include `norasupholstery.ca` and the exact stable preview hostname you use (including the `.dev` hostname if that is your preview domain). The function checks both the Turnstile action and that the returned hostname matches the request's hostname, so preview forms continue to work on their own hostname. Add `PUBLIC_TURNSTILE_SITE_KEY` as a regular build variable in each environment where the form should work; it is safe to expose in the browser. The referral question and photos are optional; the other text fields are required. When photos are supplied, the function enforces a maximum of five files and 5 MB per photo, approved image formats and basic image-file signatures. It replaces visitor-provided filenames with generated `project-photo-N` names and sets the MIME type from the accepted image type. It also enforces field lengths, allowed form fields, email and phone formats, approved referral choices, Turnstile verification and a streamed request-size ceiling before multipart parsing and email delivery.

Photo attachments are encoded and sent to Resend in small chunks with backpressure. The function does not build full Base64 attachment strings or a second complete JSON email body in memory. Multipart parsing still buffers the incoming files, capped at 28 MiB for the complete request; the five-file and 5 MiB-per-file limits continue to apply. This uses the existing Resend connection and requires no additional Cloudflare bindings or storage.

Run `node scripts/verify-quote-stream.mjs` to check the upload path locally without sending email. The checks cover Base64 chunk boundaries, five maximum-size photos, bounded encoding reads, cancellation, read failures and rejected uploads. These checks mock Resend; confirm actual inbox delivery using the configured Cloudflare environment before relying on the deployed form.

The hidden honeypot reduces simple automated spam, and Turnstile requires each request to carry a valid one-time token. Configure a Cloudflare WAF rate-limiting rule for `POST /api/quote` as an additional safeguard. A starting expression is `http.request.method eq "POST" and http.request.uri.path eq "/api/quote"`; choose and monitor the threshold in the Cloudflare dashboard based on legitimate form use. Browser validation is only for convenience; the Pages Function performs the security checks that matter.

Production builds create a Content Security Policy that hashes inline scripts and styles and permits the Turnstile and Cloudflare Insights hosts used by the site. Local Astro development leaves CSP off so Vite's development tools can connect; its server still binds to `127.0.0.1`. `public/_headers` adds HSTS and frame restrictions to static responses; the Pages Function sets its own no-store, no-sniff, HSTS and restrictive CSP headers because Pages `_headers` rules do not apply to Function responses. When adding an external script, frame, image, or network connection, update the matching CSP source in `astro.config.mjs`; do not add inline event-handler attributes or inline `style` attributes. The `preview` script also binds to `127.0.0.1`. Use a Cloudflare Pages deployment preview when you need to review a preview remotely.

Until this secret is configured, the function deliberately returns a friendly unavailable response instead of silently losing customer requests.

Before testing the form publicly, submit one request with and one without photos and
confirm that both arrive in the inbox configured by `QUOTE_TO_EMAIL`. Cloudflare hosts
the function, and Resend delivers the message.

## Domain and metadata

Production builds and preview deployments both emit the public `norasupholstery.ca`
origin in canonical links, social metadata, structured data, the sitemap and the
sitemap URL in `robots.txt`. A preview deployment does not switch those URLs to its
`pages.dev` address.

Cloudflare Email Address Obfuscation may still obfuscate email links in rendered page
content. The site's public Organization structured data includes the business email
for search and assistant crawlers. This does not accept or send estimate requests;
the contact form still requires server-side Turnstile verification.
