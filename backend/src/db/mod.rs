use chrono::NaiveDateTime;
use diesel::{r2d2, result::Error, Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::db::schema::{collections, users, vocab_words};

pub mod collection;
pub mod schema;
pub mod user;

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[table_name = "users"]
pub struct User {
    pub id:         String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

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
            _ => StorageError::DatabaseError(e.to_string()),
        }
    }
}

impl From<r2d2::PoolError> for StorageError {
    fn from(e: r2d2::PoolError) -> Self {
        StorageError::DatabaseError(e.to_string())
    }
}
