use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    Router,
};

use crate::{
    db,
    errors::{ApiError, AuthErrorReason},
    extractor::FirebaseAuthToken,
    protocol::User,
    AppState,
    JsonApiResult,
    JsonResponse,
};

pub fn create_routes() -> Router<AppState> {
    Router::new().route("/:user_id", get(handle_get_user))
}

pub async fn handle_get_user(
    FirebaseAuthToken(token): FirebaseAuthToken,
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> JsonApiResult<User> {
    if user_id != token.uid {
        return Err(ApiError::AuthError(AuthErrorReason::InvalidToken));
    } else {
        let user: Option<db::users::Data> = state
            .prisma
            .users()
            .find_unique(db::users::id::equals(user_id))
            .exec()
            .await
            .unwrap();

        let user = User {
            id: "dummy".to_string(),
        };

        Ok(JsonResponse {
            status: StatusCode::OK,
            body:   user,
        })
    }
}

pub async fn handle_create_user(
    State(state): State<AppState>,
) -> JsonApiResult<User> {
    Ok(JsonResponse {
        status: StatusCode::OK,
        body:   User {
            id: "dummy".to_string(),
        },
    })
}
