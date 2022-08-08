BEGIN;

RENAME TABLE collections TO collection;
ALTER TABLE collection
MODIFY COLUMN description TEXT NOT NULL;

RENAME TABLE users TO user;

RENAME TABLE vocab_words TO word;
ALTER TABLE word
DROP COLUMN fails,
DROP COLUMN successes;

COMMIT;