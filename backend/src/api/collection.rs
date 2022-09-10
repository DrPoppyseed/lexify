use chrono::Utc;
use rocket::{post, routes, serde::json::Json, Route, State};
use serde::{Deserialize, Serialize};

use crate::{db::mysql, http_error::HttpError, rocket_launch::ServerState};

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
    state: &State<ServerState>,
) -> Result<(), HttpError> {
    let created_at = Utc::now().naive_utc();

    mysql::Collection::insert_collection(
        &state.db_pool,
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
