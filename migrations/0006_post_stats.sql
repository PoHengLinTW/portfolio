-- Privacy-friendly stats for writing posts: no cookies, no IPs stored.
-- post_stats holds daily totals per post:
--   views    = page loads
--   visitors = unique visitors that day
--   reads    = visitors who scrolled 60% of the post and spent 30s on it (shown publicly)

CREATE TABLE post_stats (
  slug TEXT NOT NULL,
  day TEXT NOT NULL, -- YYYY-MM-DD, UTC
  views INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0,
  reads INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, day)
);

-- Dedupes visitors within a day. hash = sha256(daily salt | ip | user agent). Rows from before
-- today are deleted along with their salt, after which the hashes cannot be linked to anyone.
CREATE TABLE stats_seen (
  day TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'view' | 'read'
  slug TEXT NOT NULL,
  hash TEXT NOT NULL,
  PRIMARY KEY (day, kind, slug, hash)
);

-- One random salt per day.
CREATE TABLE stats_salts (
  day TEXT PRIMARY KEY,
  salt TEXT NOT NULL
);
