use rocket::{
    http::{ContentType, Status},
    response,
    serde::json::Json,
    Request,
    Response,
};
use serde::{Deserialize, Serialize};

use crate::{db::StorageError, http_error::HttpError};

pub mod collection;
pub mod user;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    pub id:          String,
    pub user_id:     String,
    pub name:        String,
    pub description: Option<String>,
}

#[derive(Debug)]
pub struct ApiResponse<T> {
    pub json:   Json<T>,
    pub status: Status,
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
