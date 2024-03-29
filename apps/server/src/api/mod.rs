use futures::TryFutureExt;
use rocket::{
    http::{ContentType, Status},
    response,
    serde::json::Json,
    Request, Response, State,
};
use rocket_firebase_auth::{bearer_token::BearerToken, errors::AuthError};
use serde::{Deserialize, Serialize};
use tracing::error;

use crate::{
    db::StorageError, http_error::HttpError, rocket_launch::ServerState,
};

pub mod collection;
pub mod user;
pub mod vocab_word;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Collection {
    pub id: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    pub name: String,
    pub description: Option<String>,
    pub priority: i32,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct VocabWord {
    pub id: String,
    #[serde(rename = "collectionId")]
    pub collection_id: String,
    pub word: String,
    pub definition: String,
    pub fails: i32,
    pub successes: i32,
    pub priority: i32,
}

#[derive(Debug)]
pub struct ApiResponse<T> {
    pub json: Option<Json<T>>,
    pub status: Status,
}

pub async fn get_uid_from_token(
    state: &State<ServerState>,
    token: &BearerToken,
) -> Result<String, AuthError> {
    state.auth.verify(token).map_ok(|token| token.uid).await
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
            StorageError::NotFoundError(e) => {
                error!("{:?}", e);
                Self::not_found()
            }
            StorageError::DatabaseError(e) => {
                error!("{:?}", e);
                Self::internal_error()
            }
        }
    }
}
