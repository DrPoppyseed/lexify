use serde::{Deserialize, Serialize};

use crate::{db::StorageError, http_error::HttpError};

pub mod collection;
pub mod user;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    pub id:          String,
    pub user_id:     String,
    pub name:        String,
    pub description: Option<String>,
}

impl From<StorageError> for HttpError {
    fn from(e: StorageError) -> Self {
        match e {
            StorageError::NotFoundError(_) => Self::not_found(),
            StorageError::DatabaseError(_) => Self::internal_error(),
        }
    }
}
