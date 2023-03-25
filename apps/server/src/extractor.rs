use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts, State},
    headers::{authorization::Bearer, Authorization},
    http::request::Parts,
    RequestPartsExt,
    TypedHeader,
};
use futures::TryFutureExt;
use rocket_firebase_auth::DecodedToken;
use tracing::log::error;

use crate::{
    errors::{ApiError, AuthErrorReason},
    AppState,
};

#[derive(Debug)]
pub struct FirebaseAuthToken(pub DecodedToken);

#[async_trait]
impl<S> FromRequestParts<S> for FirebaseAuthToken
where
    S: Send + Sync,
    AppState: FromRef<S>,
{
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &S,
    ) -> Result<Self, Self::Rejection> {
        let State(state): State<AppState> =
            State::from_request_parts(parts, state)
                .map_err(|e| {
                    error!("error on getting request parts {e}");
                    ApiError::AuthError(AuthErrorReason::MissingAppState)
                })
                .await?;

        // Extract the token from the authorization header
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .map_err(|_| ApiError::AuthError(AuthErrorReason::InvalidToken))
            .await?;

        // Decode Firebase token
        let token = state
            .auth
            .verify_token(bearer.token())
            .map_err(|e| {
                error!("error on verifying bearer token");
                ApiError::AuthError(AuthErrorReason::InvalidToken)
            })
            .await?;

        Ok(FirebaseAuthToken(token))
    }
}
