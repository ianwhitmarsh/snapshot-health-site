# Snapshot Health — B2B Site

Static marketing site for Snapshot Health, built from the Figma file **SNAPSHOT B2B SITE 2026**.

**Live:** https://www.snapshot.health (Vercel project `snapshot-health`)

## Structure
- `index.html` — homepage (scroll-driven donut carousel, video sections, testimonials)
- `what-we-test.html` — What We Test page
- `about.html` — About / Our Mission page (contains the contact form)
- `terms.html` / `privacy.html` — legal pages
- `assets/css/style.css` — all styles (design tokens at the top)
- `assets/js/main.js` — interactions: adaptive lazy video loading, scroll-jacked carousel, reveal animations, donut draw/count-up, nav, form → CRM webhook
- `assets/fonts/` — MADE Mellow, MADE Tommy, Playfair Display Italic (woff2)
- `assets/img/`, `assets/video/` — optimized media (`-small` variants served to phones/slow connections)
- `vercel.json` — redirects (legacy Webflow URLs → new pages)

## Environments

| | URL | Host | Updated by |
|---|---|---|---|
| **Production** | https://www.snapshot.health | client's nginx server | client deploys from this repo |
| **Staging** | https://site-stage.snapshot.health | client's nginx server | client |
| **Preview** | https://snapshot-health.vercel.app | Vercel | auto-deploys on push to `main` |

There is no build step — these are plain static files, so "deploying" is just
getting the repo contents into the web root.

`vercel.json` (redirects for the legacy `/privacy-statement` and long terms
URLs) is **Vercel-only** — nginx ignores it, which is why real
`privacy-statement.html` and `aoivhboianboaidfbklakhsekfhvof...html` pages
also exist for the production server. Keep both in sync if those URLs change.

## Notes
- The contact form posts to a LeadConnector (GoHighLevel) inbound webhook
  configured in `assets/js/main.js`.
- Videos ship in two sizes: `name.mp4` and `name-small.mp4`. `main.js` serves
  the small variant to phones and to anyone on a slow connection or data
  saver, and nothing downloads until it is near the viewport.
