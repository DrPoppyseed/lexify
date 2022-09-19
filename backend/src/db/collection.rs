use chrono::Utc;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use tracing::error;

use crate::{
    api,
    db::{schema::collections, Collection, StorageError},
    rocket_launch::DbPool,
};

impl Collection {
    pub async fn insert_collection(
        pool: &DbPool,
        new_collection: api::Collection,
    ) -> Result<usize, StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::insert_into(collections::table)
                .values(Collection {
                    id: new_collection.id.clone(),
                    user_id: new_collection.user_id.clone(),
                    name: new_collection.name.clone(),
                    description: new_collection.description.clone(),
                    created_at,
                    updated_at: created_at,
                })
                .execute(conn)
        })
        .map_err(|e| {
            error!("[DB][insert_collection] {:#?}", e);
            StorageError::from(e)
        })
    }

    pub async fn update_collection(
        pool: &DbPool,
        collection: api::Collection,
    ) -> Result<usize, StorageError> {
        let mut pool = pool.get()?;
        let updated_at = Utc::now().naive_utc();

        pool.transaction(|conn| {
            diesel::update(
                collections::dsl::collections.find(collection.id.clone()),
            )
            .set((
                collections::name.eq(collection.name),
                collections::description.eq(collection.description),
                collections::updated_at.eq(updated_at),
            ))
            .execute(conn)
        })
        .map_err(StorageError::from)
    }

    pub async fn get_collection(
        pool: &DbPool,
        collection_id: String,
    ) -> Result<Collection, StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            collections::dsl::collections
                .find(collection_id)
                .first(conn)
        })
        .map_err(StorageError::from)
    }

    pub async fn get_collections(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Vec<Collection>, StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            collections::dsl::collections
                .filter(collections::user_id.eq(user_id))
                .get_results(conn)
        })
        .map_err(StorageError::from)
    }
}
