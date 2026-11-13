-- Homepage copy: headline, tagline, About (Markdown) and the intro fallback.

INSERT INTO settings (key, value) VALUES
  ('headline', 'Software Engineer at Bloomberg'),
  ('tagline', 'I build the web platforms other engineers ship on.'),
  ('intro', 'I work on a multi-tenant micro-frontend platform and its static-asset hosting service at Bloomberg — the infrastructure that dozens of internal and client-facing web products are built on. I like the unglamorous parts: authorization, credentials, performance, migrations, and the operational work that keeps a platform trustworthy.'),
  ('about_md', 'I work on a **multi-tenant micro-frontend platform** and its **static-asset hosting service** at Bloomberg — the infrastructure that dozens of internal and client-facing web products are built on.

I like the unglamorous parts: **authorization, credentials, performance, migrations**, and the operational work that keeps a platform trustworthy. I also led a five-team pod that migrated our company-wide React component library from Jest to Vitest.

Before Bloomberg I was a production engineering intern at Meta and a software engineer at Patere Technology in Taiwan. I studied computer science at Rice.');
