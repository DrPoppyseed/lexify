use std::io::Cursor;

use rocket::{http::Status, response::Responder, Request, Response};

#[derive(Clone, Debug)]
pub struct HttpError {
    pub body:   String,
    pub status: Status,
}

impl HttpError {
    pub fn custom_error(body: String, status: Status) -> Self {
        HttpError { body, status }
    }

    pub fn bad_request() -> Self {
        HttpError {
            body:   "Bad Request".to_string(),
            status: Status::BadRequest,
        }
    }

    pub fn unauthorized() -> Self {
        HttpError {
            body:   "Unauthorized".to_string(),
            status: Status::Unauthorized,
        }
    }

    pub fn forbidden() -> Self {
        HttpError {
            body:   "Forbidden".to_string(),
            status: Status::Forbidden,
        }
    }

    pub fn not_found() -> Self {
        HttpError {
            body:   "Not Found".to_string(),
            status: Status::NotFound,
        }
    }

    pub fn internal_error() -> Self {
        HttpError {
            body:   "Internal Server Error".to_string(),
            status: Status::InternalServerError,
        }
    }
}

impl<'a, 'o: 'a> Responder<'a, 'o> for HttpError {
    fn respond_to(self, _: &'a Request) -> Result<Response<'o>, Status> {
        Response::build()
            .status(self.status)
            .sized_body(self.body.len(), Cursor::new(self.body))
            .ok()
    }
}
