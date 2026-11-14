-- The site no longer shows a headshot; drop the settings that only served it.

DELETE FROM settings WHERE key IN ('headshot_url', 'full_name');
