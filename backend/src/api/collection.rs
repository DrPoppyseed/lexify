use chrono::Utc;
use futures::TryFutureExt;
use rocket::{http::Status, post, routes, serde::json::Json, Route, State};
use tracing::{error, info};

use crate::{
    api,
    auth::{BearerToken, Jwt},
    db,
    http_error::HttpError,
    rocket_launch::ServerState,
};

pub fn routes() -> Vec<Route> {
    routes![create_collection]
}

#[post("/", data = "<collection>")]
pub async fn create_collection(
    collection: Json<api::Collection>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][create_collection] function triggered!");

    let created_at = Utc::now().naive_utc();
    let uid = Jwt::verify(
        &token.0,
        &state.firebase_admin,
        &state.jwt_config.jwks_url,
    )
    .map_ok(|token| token.claims.sub)
    .map_err(|_| HttpError::unauthorized())
    .await?;

    info!("[API][create_collection] user={uid} inserting collection.");

    if uid != collection.user_id.clone() {
        Err(HttpError::forbidden())
    } else {
        db::Collection::insert_collection(
            &state.db_pool,
            db::Collection {
                id: collection.id.clone(),
                user_id: collection.user_id.clone(),
                name: collection.name.clone(),
                description: collection.description.clone(),
                created_at,
                updated_at: created_at,
            },
        )
        .map_ok(|_| Status::Created)
        .map_err(|e| {
            error!("[API][create_collection] {:#?}", e);
            HttpError::from(e)
        })
        .await
    }
}
