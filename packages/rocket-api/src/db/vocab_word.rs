use chrono::Utc;
use diesel::{sql_query, Connection, ExpressionMethods, QueryDsl, RunQueryDsl};

use crate::{api, db, rocket_launch::DbPool};

impl db::VocabWord {
    pub fn insert_vocab_word(
        pool: &DbPool,
        vocab_word: api::VocabWord,
    ) -> Result<api::VocabWord, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::insert_into(db::schema::vocab_words::table)
                .values(db::VocabWord {
                    id: vocab_word.id.clone(),
                    collection_id: vocab_word.collection_id.clone(),
                    word: vocab_word.word.clone(),
                    definition: Some(vocab_word.definition.clone()),
                    created_at,
                    updated_at: created_at,
                    fails: vocab_word.fails,
                    successes: vocab_word.successes,
                    priority: vocab_word.priority,
                })
                .execute(conn)
        })
        .map(|_| vocab_word)
        .map_err(db::StorageError::from)
    }

    pub fn update_vocab_word(
        pool: &DbPool,
        vocab_word: api::VocabWord,
    ) -> Result<api::VocabWord, db::StorageError> {
        let mut pool = pool.get()?;

        let updated_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::update(
                db::schema::vocab_words::dsl::vocab_words
                    .find(vocab_word.id.clone()),
            )
            .set((
                db::schema::vocab_words::word.eq(vocab_word.word.clone()),
                db::schema::vocab_words::definition
                    .eq(vocab_word.definition.clone()),
                db::schema::vocab_words::updated_at.eq(updated_at),
                db::schema::vocab_words::fails.eq(vocab_word.fails),
                db::schema::vocab_words::successes.eq(vocab_word.successes),
                db::schema::vocab_words::priority.eq(vocab_word.priority),
            ))
            .execute(conn)
        })
        .map(|_| vocab_word)
        .map_err(db::StorageError::from)
    }

    pub fn get_vocab_words_for_collection(
        pool: &DbPool,
        collection_id: &str,
    ) -> Result<Vec<db::VocabWord>, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::vocab_words::dsl::vocab_words
                .filter(
                    db::schema::vocab_words::collection_id.eq(collection_id),
                )
                .order(db::schema::vocab_words::priority.asc())
                .get_results(conn)
        })
        .map_err(db::StorageError::from)
    }

    pub fn update_vocab_words_for_collection(
        pool: &DbPool,
        vocab_words: Vec<api::VocabWord>,
    ) -> Result<Vec<api::VocabWord>, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        let values =
            vocab_words.iter().fold(String::new(), |accum, vocab_word| {
                format!(
                    "{}(\"{}\", \"{}\", \"{}\", \"{}\", {}, {}, \"{}\", \"{}\", {})",
                    if accum.is_empty() {
                        "".to_string()
                    } else {
                        format!("{accum},")
                    },
                    vocab_word.id,
                    vocab_word.collection_id,
                    vocab_word.word,
                    vocab_word.definition,
                    vocab_word.fails,
                    vocab_word.successes,
                    created_at,
                    created_at,
                    vocab_word.priority
                )
            });

        let statement = format!(
            r#"
            INSERT INTO vocab_words
                (id, collection_id, word, definition, fails, successes, created_at, updated_at, priority)
            VALUES
                {}
            ON DUPLICATE KEY UPDATE
                word = VALUES(word),
                definition = VALUES(definition),
                fails = VALUES(fails),
                successes = VALUES(successes),
                updated_at = VALUES(updated_at),
                priority = VALUES(priority);"#,
            values
        );

        pool.transaction(|conn| sql_query(statement).execute(conn))
            .map(|_| vocab_words)
            .map_err(db::StorageError::from)
    }
}
