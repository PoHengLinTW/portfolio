-- Optional per-post image for link previews (og:image / twitter:image) when a post is shared.
-- Empty means the site card (/card.png). Additive, so it is safe to apply before the code deploys.

ALTER TABLE posts ADD COLUMN cover_image TEXT NOT NULL DEFAULT '';
