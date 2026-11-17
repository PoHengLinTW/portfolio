-- Project images moved from public/images/*.png to the R2 media bucket as resized WebP
-- (560px wide; content-hashed keys, served at /media/...). Only rows still on the old paths change.

UPDATE projects SET image_url = '/media/uploads/32d5e84db368fbe72069fbeb.webp' WHERE image_url = '/images/yalnix.png';
UPDATE projects SET image_url = '/media/uploads/59ed7d5b66281c794b17b558.webp' WHERE image_url = '/images/mydb.png';
UPDATE projects SET image_url = '/media/uploads/0440f27e6b12c8f94b691ebd.webp' WHERE image_url = '/images/oneclickmeeting.png';
