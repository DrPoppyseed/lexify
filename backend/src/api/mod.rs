use futures::TryFutureExt;
use rocket::{
    http::{ContentType, Status},
    response,
    serde::json::Json,
    Request,
    Response,
    State,
};
use serde::{Deserialize, Serialize};

use crate::{
    auth::{AuthError, BearerToken, Jwt},
    db::StorageError,
    http_error::HttpError,
    rocket_launch::ServerState,
};

pub mod collection;
pub mod user;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct Collection {
    pub id:          String,
    pub user_id:     String,
    pub name:        String,
    pub description: Option<String>,
}

#[derive(Debug)]
pub struct ApiResponse<T> {
    pub json:   Option<Json<T>>,
    pub status: Status,
}

pub async fn get_uid_from_token(
    state: &State<ServerState>,
    token: &BearerToken,
) -> Result<String, AuthError> {
    Jwt::verify(&token.0, &state.firebase_admin, &state.jwt_config.jwks_url)
        .map_ok(|token| token.claims.sub)
        .await
}

impl<'r, T: serde::Serialize> response::Responder<'r, 'r> for ApiResponse<T> {
    fn respond_to(self, req: &'r Request) -> response::Result<'r> {
        Response::build_from(self.json.respond_to(req)?)
            .status(self.status)
            .header(ContentType::JSON)
            .ok()
    }
}

impl From<StorageError> for HttpError {
    fn from(e: StorageError) -> Self {
        match e {
            StorageError::NotFoundError(_) => Self::not_found(),
            StorageError::DatabaseError(_) => Self::internal_error(),
        }
    }
}
