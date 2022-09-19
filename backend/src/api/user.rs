use chrono::Utc;
use futures::TryFutureExt;
use rocket::{http::Status, post, routes, serde::json::Json, Route, State};
use tracing::error;

use crate::{
    api,
    api::ApiResponse,
    db,
    http_error::HttpError,
    rocket_launch::{DbPool, ServerState},
};

pub fn routes() -> Vec<Route> {
    routes![get_or_create_user]
}

pub async fn create_user(
    new_user: Json<api::User>,
    pool: &DbPool,
) -> Result<db::User, db::StorageError> {
    let created_at = Utc::now().naive_utc();

    let new_user = db::User {
        id: new_user.id.clone(),
        created_at,
        updated_at: created_at,
    };

    db::User::insert_user(pool, new_user.clone())
        .map_ok(|_| new_user)
        .await
}

#[post("/", data = "<user>")]
pub async fn get_or_create_user(
    state: &State<ServerState>,
    user: Json<api::User>,
) -> Result<ApiResponse<api::User>, HttpError> {
    db::User::get_user(&state.db_pool, user.id.clone())
        .and_then(|db_user| async {
            match db_user {
                Some(db_user) => Ok((db_user, Status::Ok)),
                None => {
                    create_user(user, &state.db_pool)
                        .map_ok(|user| (user, Status::Created))
                        .await
                }
            }
        })
        .map_ok(|(user, status)| ApiResponse {
            json: Some(Json(api::User { id: user.id })),
            status,
        })
        .map_err(|e| {
            error!("[API][get_or_create_user] Failed due to {:#?}", e);
            match e {
                db::StorageError::NotFoundError(_) => HttpError::not_found(),
                _ => HttpError::internal_error(),
            }
        })
        .await
}
