use rocket::{post, routes, serde::json::Json, Route};

use crate::{
    http_error::HttpError,
    lib,
    storage::mysql::{Collection, StorageError},
};

pub fn routes() -> Vec<Route> {
    routes![create_collection]
}

impl From<StorageError> for HttpError {
    fn from(e: StorageError) -> Self {
        match e {
            StorageError::NotFoundError(_) => Self::not_found(),
            StorageError::DatabaseError(_) => Self::internal_error(),
        }
    }
}

#[post("/collections", data = "<collection>")]
pub async fn create_collection(
    collection: Json<Collection>,
    conn: lib::DbConn,
) -> Result<(), HttpError> {
    Collection::insert_collection(conn, collection.into_inner())
        .await
        .map(|_| ())
        .map_err(HttpError::from)
}
