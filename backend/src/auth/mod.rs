use serde::{Deserialize, Serialize};

pub mod firebase_auth;
pub mod jwk;
pub mod jwt;

#[derive(Clone, Debug, Deserialize)]
pub struct FirebaseConfig {
    pub project_id:     String,
    pub private_key_id: String,
    pub private_key:    String,
    pub client_email:   String,
    pub client_id:      String,
}

#[derive(Debug, Deserialize, Eq, PartialEq)]
pub struct Jwk {
    pub e:   String,
    pub alg: String,
    pub kty: String,
    pub kid: String,
    pub n:   String,
}

#[derive(Debug, Deserialize)]
struct KeysResponse {
    keys: Vec<Jwk>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Jwt {
    pub aud: String,
    pub iat: u64,
    pub exp: u64,
    pub sub: String,
}

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
