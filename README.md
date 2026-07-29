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

## Automatic deploy to the production server

`.github/workflows/deploy.yml` rsyncs this repo to the production nginx server
on every push to `main`. It is **inactive** until four repository secrets are
added under Settings → Secrets and variables → Actions:

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | server IP or hostname |
| `DEPLOY_USER` | ssh user that can write to the web root |
| `DEPLOY_PATH` | absolute path to the web root, no trailing slash |
| `DEPLOY_SSH_KEY` | private half of a deploy keypair; public half goes in that user's `~/.ssh/authorized_keys` |

Until those exist the workflow runs, logs "Deploy skipped", and changes nothing.

Generate a dedicated keypair for this rather than reusing a personal one:

```
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key -N ""
# deploy_key.pub  -> append to ~/.ssh/authorized_keys on the server
# deploy_key      -> paste into the DEPLOY_SSH_KEY secret, then delete locally
```

`rsync` runs with `--delete`, so `DEPLOY_PATH` must point at the site's web root
and nothing else — anything there that is not in this repo gets removed. That is
what clears out stale assets. `README.md`, `vercel.json`, `.github/` and the git
metadata are excluded from the upload.

## Notes
- The contact form posts to a LeadConnector (GoHighLevel) inbound webhook
  configured in `assets/js/main.js`.
- Videos ship in two sizes: `name.mp4` and `name-small.mp4`. `main.js` serves
  the small variant to phones and to anyone on a slow connection or data
  saver, and nothing downloads until it is near the viewport.
