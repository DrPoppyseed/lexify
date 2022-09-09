use crate::{http_error::HttpError, storage::mysql};

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
