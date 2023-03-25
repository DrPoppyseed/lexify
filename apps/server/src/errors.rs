use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};

#[derive(Debug, Clone)]
pub enum ApiError {
    AuthError(AuthErrorReason),
}

#[derive(Debug, Clone)]
pub enum AuthErrorReason {
    InvalidToken,
    MissingAppState,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        match self {
            AuthError => StatusCode::FORBIDDEN.into_response(),
            _ => StatusCode::BAD_REQUEST.into_response(),
        }
    }
}
