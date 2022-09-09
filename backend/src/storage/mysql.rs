use chrono::{NaiveDateTime, Utc};
use diesel::{
    r2d2,
    result::Error,
    Insertable,
    OptionalExtension,
    QueryDsl,
    Queryable,
    RunQueryDsl,
};
use serde::{Deserialize, Serialize};

use crate::{
    lib,
    storage::{
        mysql::StorageError::DatabaseError,
        schema::{collections, users, vocab_words},
    },
};

#[derive(AsChangeset, Queryable, Insertable, Serialize, Deserialize, Debug)]
#[table_name = "collections"]
pub struct Collection {
    pub id:          String,
    pub user_id:     Option<String>,
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
    pub collection_id: Option<String>,
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
        conn: lib::DbConn,
        new_collection: Collection,
    ) -> Result<usize, StorageError> {
        conn.run(move |c| {
            diesel::insert_into(collections::table)
                .values(&new_collection)
                .execute(c)
        })
        .await
        .map_err(StorageError::from)
    }

    pub async fn update_collection(
        conn: lib::DbConn,
        collection: Collection,
    ) -> Result<usize, StorageError> {
        let updated_at = Utc::now().naive_utc();

        conn.run(move |c| {
            diesel::update(
                collections::dsl::collections.find(collection.id.clone()),
            )
            .set(Collection {
                updated_at,
                ..collection
            })
            .execute(c)
        })
        .await
        .map_err(StorageError::from)
    }

    pub async fn get_collection(
        conn: lib::DbConn,
        collection_id: String,
    ) -> Result<Collection, StorageError> {
        conn.run(move |c| {
            collections::dsl::collections.find(collection_id).first(c)
        })
        .await
        .map_err(StorageError::from)
    }
}

impl User {
    pub async fn insert_user(
        conn: &lib::DbConn,
        new_user: User,
    ) -> Result<User, StorageError> {
        conn.run(move |c| {
            diesel::insert_into(users::table)
                .values(&new_user)
                .execute(c)
                .map(|_| new_user)
        })
        .await
        .map_err(StorageError::from)
    }

    pub async fn get_user(
        conn: &lib::DbConn,
        user_id: String,
    ) -> Result<Option<User>, StorageError> {
        conn.run(move |c| users::dsl::users.find(user_id).first(c).optional())
            .await
            .map_err(StorageError::from)
    }
}
