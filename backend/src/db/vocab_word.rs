use chrono::Utc;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use tracing::error;

use crate::{api, db, rocket_launch::DbPool};

impl db::VocabWord {
    pub async fn insert_vocab_word(
        pool: &DbPool,
        vocab_word: api::VocabWord,
    ) -> Result<usize, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::insert_into(db::schema::vocab_words::table)
                .values(db::VocabWord {
                    id: vocab_word.id,
                    collection_id: vocab_word.collection_id,
                    word: vocab_word.word,
                    definition: Some(vocab_word.definition),
                    created_at,
                    updated_at: created_at,
                    fails: vocab_word.fails,
                    successes: vocab_word.successes,
                })
                .execute(conn)
        })
        .map_err(|e| {
            error!("[DB][insert_vocab_word] {:#?}", e);
            db::StorageError::from(e)
        })
    }

    pub async fn update_vocab_word(
        pool: &DbPool,
        vocab_word: api::VocabWord,
    ) -> Result<usize, db::StorageError> {
        let mut pool = pool.get()?;

        let updated_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::update(
                db::schema::vocab_words::dsl::vocab_words
                    .find(vocab_word.id.clone()),
            )
            .set((
                db::schema::vocab_words::word.eq(vocab_word.word),
                db::schema::vocab_words::definition.eq(vocab_word.definition),
                db::schema::vocab_words::updated_at.eq(updated_at),
                db::schema::vocab_words::fails.eq(vocab_word.fails),
                db::schema::vocab_words::successes.eq(vocab_word.successes),
            ))
            .execute(conn)
        })
        .map_err(|e| {
            error!("[DB][insert_vocab_word] {:#?}", e);
            db::StorageError::from(e)
        })
    }

    pub async fn get_vocab_words_for_collection(
        pool: &DbPool,
        collection_id: &str,
    ) -> Result<Vec<db::VocabWord>, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::vocab_words::dsl::vocab_words
                .filter(
                    db::schema::vocab_words::collection_id.eq(collection_id),
                )
                .get_results(conn)
        })
        .map_err(db::StorageError::from)
    }
}
