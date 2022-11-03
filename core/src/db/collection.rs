use chrono::Utc;
use diesel::{sql_query, Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use tracing::error;

use crate::{api, db, rocket_launch::DbPool};

impl db::Collection {
    pub fn insert_collection(
        pool: &DbPool,
        collection: api::Collection,
    ) -> Result<api::Collection, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        pool.transaction(|conn| {
            diesel::insert_into(db::schema::collections::table)
                .values(db::Collection {
                    id: collection.id.clone(),
                    user_id: collection.user_id.clone(),
                    name: collection.name.clone(),
                    description: collection.description.clone(),
                    created_at,
                    updated_at: created_at,
                    priority: collection.priority,
                })
                .execute(conn)
        })
        .map(|_| collection)
        .map_err(db::StorageError::from)
    }

    pub fn update_collection(
        pool: &DbPool,
        collection: api::Collection,
    ) -> Result<api::Collection, db::StorageError> {
        let mut pool = pool.get()?;
        let updated_at = Utc::now().naive_utc();

        pool.transaction(|conn| {
            diesel::update(
                db::schema::collections::dsl::collections
                    .find(collection.id.clone()),
            )
            .set((
                db::schema::collections::name.eq(collection.name.clone()),
                db::schema::collections::description
                    .eq(collection.description.clone()),
                db::schema::collections::updated_at.eq(updated_at),
            ))
            .execute(conn)
        })
        .map(|_| collection)
        .map_err(db::StorageError::from)
    }

    pub fn get_collection(
        pool: &DbPool,
        collection_id: &str,
    ) -> Result<db::Collection, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::collections::dsl::collections
                .find(collection_id)
                .first(conn)
        })
        .map_err(db::StorageError::from)
    }

    pub fn get_collections(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Vec<db::Collection>, db::StorageError> {
        let mut pool = pool.get()?;

        pool.transaction(|conn| {
            db::schema::collections::dsl::collections
                .filter(db::schema::collections::user_id.eq(user_id))
                .order(db::schema::collections::priority.asc())
                .get_results(conn)
        })
        .map_err(db::StorageError::from)
    }

    pub fn update_collections(
        pool: &DbPool,
        collections: &[api::Collection],
    ) -> Result<Vec<api::Collection>, db::StorageError> {
        let mut pool = pool.get()?;

        let created_at = Utc::now().naive_utc();
        let values =
            collections.iter().fold(String::new(), |accum, collection| {
                format!(
                    "{}(\"{}\", \"{}\", \"{}\", \"{}\", \"{}\", \"{}\", {})",
                    if accum.is_empty() {
                        String::default()
                    } else {
                        format!("{accum},")
                    },
                    collection.id,
                    collection.user_id,
                    collection.name,
                    collection.description.clone().unwrap_or_default(),
                    created_at,
                    created_at,
                    collection.priority
                )
            });

        let statement = format!(
            r#"
            INSERT INTO collections
                (id, user_id, name, description, created_at, updated_at, priority)
            VALUES
                {}
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                description = VALUES(description),
                updated_at = VALUES(updated_at),
                priority = VALUES(priority);"#,
            values
        );

        pool.transaction(|conn| sql_query(statement).execute(conn))
            .map(|_| collections.to_vec())
            .map_err(|e| {
                error!("{:#?}", e);
                db::StorageError::from(e)
            })
    }
}
