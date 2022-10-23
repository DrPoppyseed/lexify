BEGIN;

ALTER TABLE collections
DROP COLUMN priority;

COMMIT;
