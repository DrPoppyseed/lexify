use crate::auth::{firebase_auth::FirebaseConfig, jwt::Jwt};

mod firebase_auth;
mod jwk;
mod jwt;

pub static FIREBASE_AUTHENTICATION_AUDIENCE: &str =
  "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

pub fn create_custom_token(
    uid: &str,
) -> Result<String, jsonwebtoken::errors::Error> {
    let firebase_config = FirebaseConfig::new();

    Jwt::encode(
        FIREBASE_AUTHENTICATION_AUDIENCE,
        firebase_config.private_key_id,
        firebase_config.private_key,
        uid.to_string(),
    )
}
