# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio site (henrylin.dev): Next.js 16 App Router + React 19 + Tailwind v4, deployed to Cloudflare Workers via OpenNext, with all content stored in Cloudflare D1 and edited through a built-in `/admin` CMS.

**Read `AGENTS.md` first.** This Next.js version has breaking changes vs. older training data — consult `node_modules/next/dist/docs/` before writing Next.js code. (`next dev` regenerates the `AGENTS.md` block; that is expected.)

## Commands

```bash
npm run dev                 # next dev (local D1 via initOpenNextCloudflareForDev in next.config.ts)
npm run lint                # eslint . (next core-web-vitals + typescript configs)
npm run typecheck           # tsc --noEmit
npm run build               # next build
npm run preview             # build with OpenNext and run on the local Workers runtime
npm run deploy              # build with OpenNext and deploy to Cloudflare
npm run cf-typegen          # regenerate cloudflare-env.d.ts after changing bindings/vars in wrangler.jsonc
npm run db:migrate:local    # apply migrations/ to the local D1 (run before first `npm run dev`)
npm run db:migrate:remote   # apply migrations/ to production D1
```

There is no test suite. Verify changes with `npm run lint && npm run typecheck`, and `npm run preview` for anything Cloudflare-runtime specific.

## Architecture

**Content lives in D1, not in the repo.** Every public page reads from the `DB` binding at request time; there is no static content or MDX. Schema and initial content are SQL migrations in `migrations/` (`0001_init.sql` schema, `0002_seed.sql`/`0003_*` seed data). Schema changes = a new numbered migration file, never edits to applied ones.

**Data layer — `src/lib/db.ts`.** `getDB()` calls `connection()` before `getCloudflareContext()`, which deliberately opts every route that touches the DB into dynamic rendering so admin edits appear without a redeploy. Query helpers are wrapped in React `cache()` so a page and its `generateMetadata` share one query. List-valued columns (`tags`, `highlights`, `details`, `items` — see `LIST_COLUMNS`) are stored as JSON-array strings and decoded to `string[]` automatically. `settings` is a key/value table read as `Record<string, string>` (name, headline, tagline, about_md, social URLs, etc.).

**Admin CMS — schema-driven.** `src/lib/admin-schema.ts` defines `ENTITIES` (table, fields, field types, list-view columns, public URL) and `SETTINGS_FIELDS`. The generic routes `src/app/admin/[entity]/page.tsx` (list) and `[entity]/[id]/page.tsx` (edit; `id === 'new'` creates) plus `form-fields.tsx` render forms from that schema, and `src/app/admin/actions.ts` server actions build SQL from it. Table/column names come only from the schema, never from user input. To add a field: add a migration, update the TS interface in `db.ts`, and add it to the entity's `fields` — the admin UI and save logic follow automatically. Saves call `revalidatePath('/', 'layout')`.

**Auth — `src/lib/auth.ts`.** `/admin*` is protected by a Cloudflare Access application at the edge; the app additionally verifies the `cf-access-jwt-assertion` JWT (via `jose`, against `CF_ACCESS_TEAM_DOMAIN`/`CF_ACCESS_AUD` from `wrangler.jsonc` vars) in the admin layout and in every server action (`requireAdmin()`). In `NODE_ENV=development` the check is bypassed (returns `'local-dev'`). New admin server actions must call `requireAdmin()` first.

**Markdown — `src/lib/markdown.ts`.** `renderMarkdown()` (marked) returns `{ html, toc }` with slugified heading ids. It first strips HTML comments (used as drafting notes) and removes headings whose sections are empty, so half-written case studies render cleanly. Used for case study/post bodies and `settings.about_md`.

**Public routes.** `/` is the "Split Index" homepage: sticky left identity column with `ScrollSpyNav`, right column of sections that appear only when they have content (work, experience, projects, writing). Detail/list pages: `/work/[slug]` (case studies), `/experience`, `/projects`, `/writing/[slug]`. Shared row/section components are in `src/components/`.

**Styling.** Tailwind v4 with CSS-variable palette tokens in `src/app/globals.css` (`--bg`, `--fg`, `--accent`, …) exposed as Tailwind colors via `@theme inline` (`bg-bg`, `text-fg-strong`, `text-accent`, etc.). Dark mode follows `prefers-color-scheme`; use the tokens rather than raw colors.

**Config notes.** `typedRoutes: true` in `next.config.ts` — dynamic hrefs need `as Route`. `/resume` redirects to `public/resume.pdf`. Code style: 2-space, single quotes, no semicolons.
