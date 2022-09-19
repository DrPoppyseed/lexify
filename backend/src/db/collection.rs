use chrono::Utc;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use tracing::error;

use crate::{api, db, rocket_launch::DbPool};

impl db::Collection {
    pub async fn insert_collection(
        pool: &DbPool,
        new_collection: api::Collection,
    ) -> Result<usize, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::insert_into(db::schema::collections::table)
                .values(db::Collection {
                    id: new_collection.id,
                    user_id: new_collection.user_id,
                    name: new_collection.name,
                    description: new_collection.description,
                    created_at,
                    updated_at: created_at,
                })
                .execute(conn)
        })
        .map_err(|e| {
            error!("[DB][insert_collection] {:#?}", e);
            db::StorageError::from(e)
        })
    }

    pub async fn update_collection(
        pool: &DbPool,
        collection: api::Collection,
    ) -> Result<usize, db::StorageError> {
        let mut pool = pool.get()?;
        let updated_at = Utc::now().naive_utc();

        pool.transaction(|conn| {
            diesel::update(
                db::schema::collections::dsl::collections
                    .find(collection.id.clone()),
            )
            .set((
                db::schema::collections::name.eq(collection.name),
                db::schema::collections::description.eq(collection.description),
                db::schema::collections::updated_at.eq(updated_at),
            ))
            .execute(conn)
        })
        .map_err(db::StorageError::from)
    }

    pub async fn get_collection(
        pool: &DbPool,
        collection_id: String,
    ) -> Result<db::Collection, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::collections::dsl::collections
                .find(collection_id)
                .first(conn)
        })
        .map_err(db::StorageError::from)
    }

    pub async fn get_collections(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Vec<db::Collection>, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::collections::dsl::collections
                .filter(db::schema::collections::user_id.eq(user_id))
                .get_results(conn)
        })
        .map_err(db::StorageError::from)
    }
}
