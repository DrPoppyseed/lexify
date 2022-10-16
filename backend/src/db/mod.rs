use chrono::NaiveDateTime;
use diesel::{r2d2, result::Error, Insertable, Queryable};
use serde::{Deserialize, Serialize};

use schema::{collections, users, vocab_words};

pub mod collection;
pub mod schema;
pub mod user;
pub mod vocab_word;

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = users)]
pub struct User {
    pub id:         String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(AsChangeset, Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = collections)]
pub struct Collection {
    pub id:          String,
    pub user_id:     String,
    pub name:        String,
    pub description: Option<String>,
    pub created_at:  NaiveDateTime,
    pub updated_at:  NaiveDateTime,
}

#[derive(
    AsChangeset, Queryable, Insertable, Serialize, Deserialize, Debug, Clone,
)]
#[diesel(table_name = vocab_words)]
pub struct VocabWord {
    pub id:            String,
    pub collection_id: String,
    pub word:          String,
    pub definition:    Option<String>,
    pub fails:         i32,
    pub successes:     i32,
    pub created_at:    NaiveDateTime,
    pub updated_at:    NaiveDateTime,
    pub priority:      i32,
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
