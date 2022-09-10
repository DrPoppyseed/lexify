use crate::{db::mysql, http_error::HttpError};

pub mod collection;
pub mod user;

impl From<mysql::StorageError> for HttpError {
    fn from(e: mysql::StorageError) -> Self {
        match e {
            mysql::StorageError::NotFoundError(_) => Self::not_found(),
            mysql::StorageError::DatabaseError(_) => Self::internal_error(),
        }
    }
}
