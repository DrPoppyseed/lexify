BEGIN;

ALTER TABLE vocab_words
DROP COLUMN priority;

COMMIT;