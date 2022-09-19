use std::ops::Deref;

use chrono::Utc;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use tracing::{error, info};

use crate::{
    db::{schema::collections, Collection, StorageError},
    rocket_launch::DbPool,
};

impl Collection {
    pub async fn insert_collection(
        pool: &DbPool,
        new_collection: Collection,
    ) -> Result<usize, StorageError> {
        let pool = pool.get().map_err(|e| {
            info!("[DB][insert_collection] Failed to get database connection from pool: {:#?}", e);
            StorageError::from(e)
        })?;

        pool.transaction(|| {
            diesel::insert_into(collections::table)
                .values(&new_collection)
                .execute(pool.deref())
        })
        .map_err(|e| {
            error!("[DB][insert_collection] {:#?}", e);
            StorageError::from(e)
        })
    }

    pub async fn update_collection(
        pool: &DbPool,
        collection: Collection,
    ) -> Result<usize, StorageError> {
        let pool = pool.get()?;
        let updated_at = Utc::now().naive_utc();

        pool.transaction(|| {
            diesel::update(
                collections::dsl::collections.find(collection.id.clone()),
            )
            .set(Collection {
                updated_at,
                ..collection
            })
            .execute(pool.deref())
        })
        .map_err(StorageError::from)
    }

    pub async fn get_collection(
        pool: &DbPool,
        collection_id: String,
    ) -> Result<Collection, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            collections::dsl::collections
                .find(collection_id)
                .first(pool.deref())
        })
        .map_err(StorageError::from)
    }

    pub async fn get_collections(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Vec<Collection>, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            collections::dsl::collections
                .filter(collections::user_id.eq(user_id))
                .get_results(pool.deref())
        })
        .map_err(StorageError::from)
    }
}
