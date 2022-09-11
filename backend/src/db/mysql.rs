use std::ops::Deref;

use chrono::{NaiveDateTime, Utc};
use diesel::{
    r2d2,
    result::Error,
    Connection,
    Insertable,
    OptionalExtension,
    QueryDsl,
    Queryable,
    RunQueryDsl,
};
use serde::{Deserialize, Serialize};

use crate::{
    db::{
        mysql::StorageError::DatabaseError,
        schema::{collections, users, vocab_words},
    },
    rocket_launch::DbPool,
};

#[derive(AsChangeset, Queryable, Insertable, Serialize, Deserialize, Debug)]
#[table_name = "collections"]
pub struct Collection {
    pub id:          String,
    pub user_id:     String,
    pub name:        String,
    pub description: Option<String>,
    pub created_at:  NaiveDateTime,
    pub updated_at:  NaiveDateTime,
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[table_name = "users"]
pub struct User {
    pub id:         String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "vocab_words"]
pub struct Word {
    pub id:            String,
    pub collection_id: String,
    pub word:          String,
    pub definition:    Option<String>,
    pub created_at:    NaiveDateTime,
    pub updated_at:    NaiveDateTime,
    pub fails:         i32,
    pub successes:     i32,
}

#[derive(Debug)]
pub enum StorageError {
    DatabaseError(String),
    NotFoundError(String),
}

impl From<Error> for StorageError {
    fn from(e: Error) -> Self {
        match e {
            Error::NotFound => Self::NotFoundError(e.to_string()),
            _ => DatabaseError(e.to_string()),
        }
    }
}

impl From<r2d2::PoolError> for StorageError {
    fn from(e: r2d2::PoolError) -> Self {
        DatabaseError(e.to_string())
    }
}

impl Collection {
    pub async fn insert_collection(
        pool: &DbPool,
        new_collection: Collection,
    ) -> Result<usize, StorageError> {
        let pool = pool.get().map_err(|e| {
            println!("[DB][insert_collection] Failed to get database connection from pool: {:#?}", e);
            StorageError::from(e)
        })?;

        pool.transaction(|| {
            diesel::insert_into(collections::table)
                .values(&new_collection)
                .execute(pool.deref())
        })
        .map_err(|e| {
            println!("[DB][insert_collection] {:#?}", e);
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
}

impl User {
    pub async fn insert_user(
        pool: &DbPool,
        new_user: User,
    ) -> Result<User, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            diesel::insert_into(users::table)
                .values(&new_user)
                .execute(pool.deref())
                .map(|_| new_user)
        })
        .map_err(StorageError::from)
    }

    pub async fn get_user(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Option<User>, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            users::dsl::users
                .find(user_id)
                .first(pool.deref())
                .optional()
        })
        .map_err(StorageError::from)
    }

    pub async fn get_user_pooled(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Option<User>, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            users::dsl::users
                .find(user_id)
                .first(pool.deref())
                .optional()
        })
        .map_err(StorageError::from)
    }
}
