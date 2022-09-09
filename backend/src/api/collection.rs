use chrono::Utc;
use rocket::{post, routes, serde::json::Json, Route};
use serde::{Deserialize, Serialize};

use crate::{http_error::HttpError, lib, storage::mysql};

pub fn routes() -> Vec<Route> {
    routes![create_collection]
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    pub id:          String,
    pub user_id:     Option<String>,
    pub name:        String,
    pub description: Option<String>,
}

#[post("/collections", data = "<collection>")]
pub async fn create_collection(
    collection: Json<Collection>,
    conn: lib::DbConn,
) -> Result<(), HttpError> {
    let created_at = Utc::now().naive_utc();

    mysql::Collection::insert_collection(
        conn,
        mysql::Collection {
            id: collection.id.clone(),
            user_id: collection.user_id.clone(),
            name: collection.name.clone(),
            description: collection.description.clone(),
            created_at,
            updated_at: created_at,
        },
    )
    .await
    .map(|_| ())
    .map_err(HttpError::from)
}
