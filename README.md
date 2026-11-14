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
- **Static files** live in `public/` and need a deploy to change:
  - `resume.pdf`: the résumé (`/resume` redirects here)
  - `images/headshot.jpg`: the homepage headshot, a 320×320 square crop shown at 64×64. The `headshot_url` setting points here.
  - `images/yalnix.png`, `images/mydb.png`, `images/oneclickmeeting.png`: project images
  - `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `card.png`: icons and the Open Graph image
  - `_headers`: Cloudflare cache headers for static assets

To add an image, put it in `public/images/`, deploy, then set its path (for example `/images/foo.png`) in the admin.

## Deployment

`npm run deploy` builds and deploys the Worker defined in `wrangler.jsonc`. Before deploying a change that adds a migration, run `npm run db:migrate:remote`.
