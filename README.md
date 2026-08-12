# Nora's Upholstery website

Static Astro website for Nora's Upholstery. The repository root is the website root.

## Local setup

Use Node 22.12 or newer and npm. Do not upload `node_modules`, `.astro`, or `dist` to GitHub.

```sh
npm ci
npm run dev
```

Production check:

```sh
npm run build
npm run preview
```

`package.json` declares the allowed dependency versions. `package-lock.json` records the exact tested dependency tree and must be committed with it. The project intentionally uses npm as its deployment package manager.

## Deployment

See `CLOUDFLARE.md` for Cloudflare Pages settings and the estimate-form secret.
