use chrono::Utc;
use futures::TryFutureExt;
use rocket::{post, routes, serde::json::Json, Route, State};
use serde::{Deserialize, Serialize};

use crate::{
    db::{mysql, mysql::StorageError},
    http_error::HttpError,
    rocket_launch::{DbPool, ServerState},
};

pub fn routes() -> Vec<Route> {
    routes![get_or_create_user]
}

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: String,
}

pub async fn create_user(
    new_user: Json<User>,
    db_user: Option<mysql::User>,
    pool: &DbPool,
) -> Result<User, StorageError> {
    let created_at = Utc::now().naive_utc();

    match db_user {
        Some(db_user) => Ok(User { id: db_user.id }),
        None => {
            mysql::User::insert_user(
                pool,
                mysql::User {
                    id: new_user.id.clone(),
                    created_at,
                    updated_at: created_at,
                },
            )
            .map_ok(|user| User { id: user.id })
            .await
        }
    }
}

#[post("/users", data = "<user>")]
pub async fn get_or_create_user(
    state: &State<ServerState>,
    user: Json<User>,
) -> Result<Json<User>, HttpError> {
    mysql::User::get_user(&state.db_pool, user.id.clone())
        .and_then(|db_user| create_user(user, db_user, &state.db_pool))
        .map_ok(Json)
        .map_err(|e| match e {
            StorageError::NotFoundError(_) => HttpError::not_found(),
            _ => HttpError::internal_error(),
        })
        .await
}
