use chrono::Utc;
use futures::TryFutureExt;
use rocket::{post, routes, serde::json::Json, Route, State};

use crate::{
    api,
    db,
    http_error::HttpError,
    rocket_launch::{DbPool, ServerState},
};

pub fn routes() -> Vec<Route> {
    routes![get_or_create_user]
}

pub async fn create_user(
    new_user: Json<api::User>,
    db_user: Option<db::User>,
    pool: &DbPool,
) -> Result<api::User, db::StorageError> {
    let created_at = Utc::now().naive_utc();

    match db_user {
        Some(db_user) => Ok(api::User { id: db_user.id }),
        None => {
            db::User::insert_user(
                pool,
                db::User {
                    id: new_user.id.clone(),
                    created_at,
                    updated_at: created_at,
                },
            )
            .map_ok(|user| api::User { id: user.id })
            .await
        }
    }
}

#[post("/users", data = "<user>")]
pub async fn get_or_create_user(
    state: &State<ServerState>,
    user: Json<api::User>,
) -> Result<Json<api::User>, HttpError> {
    db::User::get_user(&state.db_pool, user.id.clone())
        .and_then(|db_user| create_user(user, db_user, &state.db_pool))
        .map_ok(Json)
        .map_err(|e| match e {
            db::StorageError::NotFoundError(_) => HttpError::not_found(),
            _ => HttpError::internal_error(),
        })
        .await
}
