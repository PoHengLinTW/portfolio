# henrylin.dev

Personal portfolio site, built with Next.js 16 (App Router), React 19 and Tailwind CSS v4. It runs on Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare). All site content is stored in Cloudflare D1 and edited through a built-in `/admin` CMS, so content changes don't need a redeploy.

## Getting started

```bash
npm install
npm run db:migrate:local   # create and seed the local D1 database
npm run dev                # http://localhost:3000
```

In local development the `/admin` auth check is skipped.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with the local D1 binding |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run preview` | Build with OpenNext and run on the local Workers runtime |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare |
| `npm run db:migrate:local` | Apply `migrations/` to the local D1 database |
| `npm run db:migrate:remote` | Apply `migrations/` to the production D1 database |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` after changing `wrangler.jsonc` |

There is no test suite. Check changes with `npm run lint && npm run typecheck`, and use `npm run preview` for anything that depends on the Cloudflare runtime.

## Project layout

```
src/app/            Routes: / (Split Index home), /work/[slug], /experience, /projects, /writing/[slug], /admin
src/components/     Shared UI (header, scroll-spy nav, entry rows)
src/lib/db.ts       D1 queries and row types
src/lib/admin-schema.ts  Entity and field definitions that drive the admin UI
src/lib/auth.ts     Cloudflare Access JWT check for /admin
src/lib/markdown.ts Markdown rendering for case studies, posts and the About section
migrations/         D1 schema and seed data (add new numbered files; never edit applied ones)
public/             Static files (see below)
```

## Content

- **Text content** (settings, experience, case studies, projects, posts) lives in D1. Edit it at `/admin`, which is protected by Cloudflare Access in production.
- **Images, GIFs and videos** live in the `portfolio-media` R2 bucket and are served at `/media/...`. Paste, drop, or use **Insert media** in any Markdown editor in the admin: the file uploads and a `![alt](/media/uploads/<hash>.webp)` line is inserted. An image alone on its line becomes a figure; add a caption with `![alt](src "Caption")`. `.mp4`/`.webm` play like a GIF (autoplay, loop, muted), so prefer them over large GIFs. For a project thumbnail, upload the same way and copy the `/media/...` URL into the project's Image URL.
- **Static files** live in `public/` and need a deploy to change:
  - `resume.pdf`: the résumé (`/resume` redirects here)
  - `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `card.png`: icons and the Open Graph image
  - `_headers`: Cloudflare cache headers for static assets

## Deployment

Merging to `main` deploys automatically. After lint, typecheck and build pass, the **Migrate and deploy** job in `.github/workflows/ci.yml` runs `npm run db:migrate:remote` and then `npm run deploy`. It uses the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets from the `Production` GitHub environment.

Migrations run before the new code is live, so each migration must work with the code currently deployed. Adding tables or columns is always safe. If a migration depends on new code (for example, data pointing at a route that doesn't exist yet), ship the code in one PR and the migration in the next.

To deploy by hand, run `npm run db:migrate:remote` and then `npm run deploy`.
