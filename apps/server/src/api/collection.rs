use futures::TryFutureExt;
use rocket::{
    get, http::Status, post, put, routes, serde::json::Json, Route, State,
};
use rocket_firebase_auth::bearer_token::BearerToken;
use tracing::{error, info};

use crate::{api, db, http_error::HttpError, rocket_launch::ServerState};

pub fn routes() -> Vec<Route> {
    routes![
        get_collection,
        get_collections,
        create_collection,
        update_collection,
        update_collections
    ]
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
        .map(|db_collections| {
            info!("[API][get_collections] collections fetched from database!");
            db_collections
                .into_iter()
                .map(|collection| api::Collection {
                    id: collection.id,
                    user_id: collection.user_id,
                    name: collection.name,
                    description: collection.description,
                    priority: collection.priority,
                })
                .collect()
        })
        .map(|api_collections| api::ApiResponse {
            json: Some(Json(api_collections)),
            status: Status::Ok,
        })
        .map_err(|e| {
            error!("[API][get_collections] {:#?}", e);
            HttpError::from(e)
        })
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
        db::Collection::insert_collection(&state.db_pool, collection.0)
            .map(|_| Status::Created)
            .map_err(|e| {
                error!("[API][create_collection] {:#?}", e);
                HttpError::from(e)
            })
    }
}

#[put("/<collection_id>", data = "<collection>")]
pub async fn update_collection(
    collection: Json<api::Collection>,
    collection_id: &str,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<api::Collection>, HttpError> {
    info!("[API][update_collection] function triggered!");
    api::get_uid_from_token(state, &token)
        .map_err(|e| {
            error!("[API][update_collection] {:?}", e);
            HttpError::unauthorized()
        })
        .and_then(|uid| async move {
            db::Collection::update_collection(&state.db_pool, collection.0)
                .map_err(HttpError::from)
                .and_then(|collection| {
                    if uid == collection.user_id
                        && collection_id == collection.id
                    {
                        Ok(collection)
                    } else {
                        Err(HttpError::forbidden())
                    }
                })
        })
        .map_ok(|collection| api::ApiResponse {
            json: Some(Json(collection)),
            status: Status::Ok,
        })
        .await
}

#[get("/<collection_id>")]
pub async fn get_collection(
    collection_id: &str,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<api::Collection>, HttpError> {
    info!("[API][get_collection] function triggered!");
    api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .and_then(|uid| async move {
            db::Collection::get_collection(&state.db_pool, collection_id)
                .map_err(HttpError::from)
                .and_then(|collection| {
                    if uid == collection.user_id {
                        Ok(collection)
                    } else {
                        Err(HttpError::forbidden())
                    }
                })
        })
        .map_ok(|collection| {
            let collection = api::Collection {
                id: collection.id,
                user_id: collection.user_id,
                name: collection.name,
                description: collection.description,
                priority: collection.priority,
            };
            api::ApiResponse {
                json: Some(Json(collection)),
                status: Status::Ok,
            }
        })
        .await
}

#[put("/", data = "<collections>")]
pub async fn update_collections(
    state: &State<ServerState>,
    token: BearerToken,
    collections: Json<Vec<api::Collection>>,
) -> Result<api::ApiResponse<Vec<api::Collection>>, HttpError> {
    info!("[API][update_collections] function triggered!");
    api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .and_then(|uid| async move {
            if collections
                .iter()
                .all(|collection| collection.user_id == uid)
            {
                Ok(collections)
            } else {
                Err(HttpError::forbidden())
            }
        })
        .map_ok(|collections| {
            db::Collection::update_collections(
                &state.db_pool,
                collections.0.as_slice(),
            )
            .map(|collections| api::ApiResponse {
                json: Some(Json(collections)),
                status: Status::Ok,
            })
            .map_err(HttpError::from)
        })
        .await?
}
