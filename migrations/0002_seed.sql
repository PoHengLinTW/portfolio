-- Initial content, from Portfolio Content Summary.md (2026-11-13).

INSERT INTO settings (key, value) VALUES
  ('name', 'Henry Lin'),
  ('full_name', 'Po-Heng (Henry) Lin'),
  ('title', 'Software Engineer'),
  ('location', 'New York, NY'),
  ('email', 'me@henrylin.dev'),
  ('github', 'https://github.com/PoHengLinTW'),
  ('linkedin', 'https://www.linkedin.com/in/pohenglintw'),
  ('resume_url', '/resume.pdf'),
  ('headshot_url', '/images/headshot.jpg');

INSERT INTO case_studies (slug, title, summary, period, role, result, tags, body_md, sort, published) VALUES
  ('authorization-service', 'Centralized authorization for a micro-frontend platform', 'Moving permission checks out of every micro-frontend and into one platform service, without hammering the upstream RBAC system.', '2025 — 2026', 'Co-designer & implementer', 'Live in production', '["Authorization", "Caching", "Message queues", "Feature flags"]', '## Context
Permission checks lived inside every micro-frontend on the platform. The goal was one centralized authorization service that every tenant could rely on, without putting heavy load on the upstream RBAC system.

## Approach

### Measure the upstream before designing the cache
Before choosing a sync model I benchmarked the RBAC APIs: a bulk fetch returned ~17K users in about 120 ms, where the per-user alternative would have needed over a thousand calls.

### Hybrid push + pull sync
The benchmark pointed to a hybrid push/pull sync between the upstream RBAC system and the service''s own cache.

### Three permission types, deliberately
<!-- TODO: write this section in /admin/case-studies -->

### Roll out behind a flag
Enforcement was rolled out behind a feature flag across three services.

## Outcome
The service is live in production.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 1, 1),
  ('api-token-lifecycle', 'An API-token lifecycle, from on-call script to self-service', 'Three years of owning machine credentials for an asset-hosting platform: issuance, verification, expiry, revocation, and finally self-service.', '2023 — 2026', 'Owner, end to end', '100+ tenants', '["JWT", "Redis", "Distributed jobs", "Security", "React"]', '## Context
Tenants of the static-asset hosting platform use API tokens as machine credentials. I owned their lifecycle for three years: issuance, verification, expiry, revocation, and self-service.

## Approach

### Keep the issuer off the hot path
Tokens are JWTs verified locally, so the issuer is not on the request path.

### Expiry that warns exactly once
An idempotent expiry job handles warnings and expiry.

### Revocation: write-through, with a safety net
Revocation goes through a write-through Redis cache.

### Small PRs after a stalled big one
<!-- TODO: write this section in /admin/case-studies -->

### Self-service
A self-service UI replaced manual issuance.

## Outcome
Hundreds of tokens issued across 100+ tenants; revocation is an API call, not a deploy.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 2, 1),
  ('config-service-performance', 'Cutting a config service''s runtime ~75% — and fixing its race', 'Profiling a legacy write path that slowed down with every tenant, then hunting a duplicate-write race across load-balanced servers.', '2024 — 2025', 'Owner of the performance and concurrency work', '~75% less runtime', '["Profiling", "PostgreSQL", "Concurrency", "Migrations"]', '## Context
A legacy config-service write path got slower with every tenant added to the platform.

## Approach

### Profile before optimizing
Profiling found a commit hook that rebuilt every tenant''s manifest on each write.

### Then fix the reads
Hydrating one portal took over a hundred queries through the ORM. Replacing ORM hydration with SQL cut that roughly 2.5×.

### A race across servers
A duplicate-write race across load-balanced servers was fixed with PostgreSQL row locking.

### Strangling the legacy service
<!-- TODO: write this section in /admin/case-studies -->

## Outcome
Write runtime dropped about 75% in production.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 3, 1),
  ('self-service-approvals', 'Self-service with audited approvals for a multi-tenant platform', 'Replacing ticket-driven platform changes with a self-service portal: a permission model tenants can live with, and a production change-approval flow certified with another org.', '2024 — 2026', 'Permission-model designer; owner of the approval integration', '1,000+ requests in ~2 months', '["Self-service", "Authorization", "Workflows", "Data modeling"]', '## Context
Platform changes were ticket-driven. The aim was a self-service portal tenants could use directly, with audited approvals for production changes.

## Approach

### A permission model tenants can live with
<!-- TODO: write this section in /admin/case-studies -->

### A new approval type, certified across org boundaries
The production change-approval flow was certified together with another org.

### Taking the critique: workflow state is not audit
<!-- TODO: write this section in /admin/case-studies -->

### Either side can ask (2026)
<!-- TODO: write this section in /admin/case-studies -->

## Outcome
Tenants raised over a thousand change requests through self-service in about two months, a couple hundred of them for production entities.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 4, 1),
  ('observability', 'The metrics were lying by 4×: instrumenting a control-plane API', 'Turning on per-route latency, job-health and adoption metrics, building dashboards people read correctly, and finding a bug that divided every count by the pod count.', '2026', 'Owner', '4× undercount fixed', '["Observability", "Metrics", "Dashboards", "Debugging"]', '## Context
The platforms'' control-plane API needed metrics people could trust: per-route latency, job health and adoption.

## Approach

### Measure what matters, with bounded tags
Per-route latency and error rates for the API in one place (hundreds of thousands of requests a week, with a server-error rate well under 0.1% at the time of writing).

### Dashboards that explain themselves
Grafana dashboards for three services, built on one template, plus per-tenant storage alerts at 65% capacity.

### The metrics were lying
On a multi-pod production deployment, the logs showed four times as many server starts as the dashboard did. A bug divided every count by the pod count.

## Outcome
The 4× undercount is fixed.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 5, 1),
  ('test-runner-migration', 'Leading a test-runner migration across five teams, without authority', 'Moving a company-wide React component library from Jest to Vitest with a volunteer pod of five engineers from five teams, then shipping the final cutover.', '2026', 'Pod lead', '1,700+ tests · Jest removed', '["Leadership", "Migrations", "Testing", "React"]', '## Context
The company-wide React component library ran on Jest. I led a volunteer pod of five engineers from five teams to move it to Vitest.

## Approach

### Make contributing cheap
<!-- TODO: write this section in /admin/case-studies -->

### Build the unblocker myself
<!-- TODO: write this section in /admin/case-studies -->

### Easiest first, with invariants
<!-- TODO: write this section in /admin/case-studies -->

### The mock was lying
<!-- TODO: write this section in /admin/case-studies -->

### The cutover
I shipped the final cutover that removed Jest.

## Outcome
1,700+ tests moved to Vitest; Jest removed.

## What I learned
<!-- TODO: write this section in /admin/case-studies -->
', 6, 1);

INSERT INTO roles (company, title, location, start, end, url, summary, highlights, tags, sort) VALUES
  ('Bloomberg L.P.', 'Software Engineer', 'New York, NY', 'Feb 2023', 'Present', 'https://www.bloomberg.com', 'Core engineer on the firm''s two flagship web platforms: a multi-tenant micro-frontend PaaS composing dozens of internal and client portals, and its static-asset hosting platform serving 100+ tenants.', '["Co-designed and built a centralized authorization service, now in production. Benchmarked upstream RBAC APIs to choose a hybrid push/pull sync and rolled out enforcement behind a feature flag across three services.", "Cut config-service write runtime ~75% in production by finding a commit hook that rebuilt every tenant''s manifest on each write and replacing ORM hydration with SQL (~2.5× fewer queries). Fixed a cross-server race with PostgreSQL row locking.", "Owned the asset-hosting platform''s API-token lifecycle for three years (100+ tenants): local JWT verification, a write-through Redis revocation cache, an idempotent expiry job, and a self-service UI that replaced manual issuance.", "Built observability for both platforms: per-route latency, job-health and adoption metrics with Grafana dashboards for three services built on one template, per-tenant storage alerts at 65% capacity, and a fix for a metrics bug that undercounted by 4×.", "Led workload-identity adoption for EU DORA compliance: authored the plan for 15 applications, onboarded the high-priority services, and closed a sudo root-escalation path with a staged, no-outage rollout.", "Migrated 50+ repositories to the company CI/CD platform with secret scanning and test coverage — most of them in the first week.", "Led a cross-team pod of five engineers from five teams that migrated the company''s React component library from Jest to Vitest, and shipped the final cutover that removed Jest (1,700+ tests).", "Designing automated TLS certificate issuance to replace manual renewals; the adoption design was approved by the CA team and the first auto-issued service certificate has shipped."]', '["TypeScript", "Node.js", "React", "Python", "PostgreSQL", "Redis", "Kafka", "RabbitMQ", "Docker", "Kubernetes"]', 1),
  ('Meta', 'Production Engineer Intern', 'Bellevue, WA', 'May 2022', 'Aug 2022', 'https://about.meta.com', 'Infrastructure team behind a distributed pub/sub service (25+ billion messages a day); I built its capacity-planning tools.', '["Turned weeks-long capacity estimates into a ~5-minute self-service tool: customer teams get the hosts and power needed to onboard onto an infra service, built on a data scientist''s model, replacing manual work by infra engineers.", "Replaced spreadsheet- and email-based capacity requests with a tracking service (Hack, React, GraphQL, MySQL) for infra customer teams; designed its features with the team and sped up its queries 10%+."]', '["Hack", "Python", "React", "GraphQL", "MySQL"]', 2),
  ('Patere Technology', 'Software Engineer', 'Hsinchu, Taiwan', 'Jun 2020', 'Jul 2021', '', 'Startup building healthcare products: a remote patient-monitoring platform and a medical hiring app with 100K+ users.', '["Built the real-time WebRTC video pipeline for the patient-monitoring platform, streaming camera feeds to teammates'' computer-vision models that assess recovery and flag dangerous movements by elderly patients.", "Cut the hiring app''s GraphQL query time 20% by batching resolver calls, removing unnecessary joins from the slowest database queries, and parallelizing reads that ran sequentially.", "Automated deployments with CI/CD on GCP and Kubernetes, replacing a 30–60-minute manual deploy process."]', '["Node.js", "Vue", "React", "WebRTC", "GraphQL", "Kubernetes", "GCP"]', 3);

INSERT INTO projects (name, period, description, details, tags, image_url, link_url, link_label, sort) VALUES
  ('Yalnix OS', 'Feb — May 2022', 'A Unix-like operating system kernel, written from scratch in C.', '["Memory management with page tables, context switching, system calls, and process scheduling.", "A unified, Ext4-style file system supporting the full set of file operations and path-name lookup."]', '["C", "Operating systems"]', '/images/yalnix.png', '', '', 1),
  ('MyDB', 'Jan — May 2022', 'A relational database engine implemented from scratch in C++.', '["Buffer and page management, a SQL lexer and parser, and relational operators (select, join, aggregation).", "Query optimization tested against datasets of 3M+ records."]', '["C++", "Databases"]', '/images/mydb.png', '', '', 2),
  ('OneClickMeeting', 'Oct 2021 · Hackathon', 'A Chrome extension built during a hackathon.', '[]', '["JavaScript", "Chrome Extensions"]', '/images/oneclickmeeting.png', '', '', 3),
  ('henrylin.dev', '2026', 'This site — Next.js App Router and Tailwind, deployed to Cloudflare Workers via OpenNext.', '["Content lives in Cloudflare D1 and is edited through a small admin UI behind Cloudflare Access, so updates go live without a redeploy.", "A Markdown-backed writing section and a system-aware dark mode."]', '["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare"]', '', 'https://github.com/PoHengLinTW/portfolio', 'Source', 4);

INSERT INTO education (school, degree, location, period, sort) VALUES
  ('Rice University', 'M.S. in Computer Science', 'Houston, TX', '2021 — 2022', 1),
  ('National Chung Cheng University', 'B.S. in Computer Science & Information Engineering', 'Chiayi, Taiwan', '2016 — 2020', 2);

INSERT INTO skill_groups (name, items, sort) VALUES
  ('Languages', '["TypeScript", "JavaScript", "Python", "C/C++", "Java", "SQL"]', 1),
  ('Frontend', '["React", "Vite", "Micro-frontends", "Component libraries", "SSR"]', 2),
  ('Backend', '["Node.js", "REST / OpenAPI", "GraphQL", "Nginx", "Kafka", "RabbitMQ", "Bull"]', 3),
  ('Infra & data', '["Docker", "Kubernetes", "Jenkins", "CI/CD", "PostgreSQL", "Redis"]', 4);

INSERT INTO posts (slug, title, summary, body_md, published_at, published) VALUES
  ('hello-world', 'Hello, world', 'A placeholder post showing how writing works on this site.', 'Posts are written in Markdown in `/admin/posts` and go live as soon as they are published — no redeploy.

```ts
console.log(''hello, world'')
```
', '2026-11-12', 0);
