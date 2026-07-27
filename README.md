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

## Deploying
No build step — plain static files. Deploy with the Vercel CLI from this directory:

```
vercel deploy --prod --yes
```

The contact form posts to a LeadConnector (GoHighLevel) inbound webhook configured in `assets/js/main.js`.
