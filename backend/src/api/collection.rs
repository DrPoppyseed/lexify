use chrono::Utc;
use futures::TryFutureExt;
use rocket::{
    get,
    http::Status,
    post,
    routes,
    serde::json::Json,
    Route,
    State,
};
use tracing::{error, info};

use crate::{
    api,
    auth::BearerToken,
    db,
    http_error::HttpError,
    rocket_launch::ServerState,
};

pub fn routes() -> Vec<Route> {
    routes![get_collections, create_collection]
}

#[get("/")]
pub async fn get_collections(
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<Vec<api::Collection>>, HttpError> {
    info!("[API][get_collections] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::Collection::get_collections(&state.db_pool, uid)
        .map_ok(|db_collections| {
            info!("[API][get_collections] collections fetched from database!");
            db_collections
                .into_iter()
                .map(|collection| api::Collection {
                    id:          collection.id,
                    user_id:     collection.user_id,
                    name:        collection.name,
                    description: collection.description,
                })
                .collect()
        })
        .map_ok(|api_collections| api::ApiResponse {
            json:   Some(Json(api_collections)),
            status: Status::Ok,
        })
        .map_err(|e| {
            error!("[API][get_collections] {:#?}", e);
            HttpError::from(e)
        })
        .await
}

#[post("/", data = "<collection>")]
pub async fn create_collection(
    collection: Json<api::Collection>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][create_collection] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    if uid != collection.user_id.clone() {
        Err(HttpError::forbidden())
    } else {
        info!("[API][create_collection] user={uid} inserting collection.");
        let created_at = Utc::now().naive_utc();
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
