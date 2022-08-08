BEGIN;

RENAME TABLE collection TO collections;
ALTER TABLE collections 
MODIFY COLUMN description TEXT;

RENAME TABLE user TO users;

RENAME TABLE word TO vocab_words;
ALTER TABLE vocab_words 
ADD COLUMN fails INT DEFAULT 0,
ADD COLUMN successes INT DEFAULT 0;

COMMIT;