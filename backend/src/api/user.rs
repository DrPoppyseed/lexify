use chrono::Utc;
use futures::TryFutureExt;
use rocket::{post, routes, serde::json::Json, Route};
use serde::{Deserialize, Serialize};

use crate::{
    http_error::HttpError,
    lib,
    storage::{mysql, mysql::StorageError},
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
    conn: &lib::DbConn,
) -> Result<User, StorageError> {
    let created_at = Utc::now().naive_utc();

    match db_user {
        Some(db_user) => Ok(User { id: db_user.id }),
        None => {
            mysql::User::insert_user(
                conn,
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
    user: Json<User>,
    conn: lib::DbConn,
) -> Result<Json<User>, HttpError> {
    mysql::User::get_user(&conn, user.id.clone())
        .and_then(|db_user| create_user(user, db_user, &conn))
        .map_ok(Json)
        .map_err(|e| match e {
            StorageError::NotFoundError(_) => HttpError::not_found(),
            _ => HttpError::internal_error(),
        })
        .await
}
