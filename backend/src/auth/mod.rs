use rocket::{
    http::Status,
    outcome::Outcome,
    request,
    request::FromRequest,
    Request,
};
use serde::{Deserialize, Serialize};

pub mod firebase_config;
pub mod jwk;
pub mod jwt;
pub mod jwt_config;

#[derive(Clone, Debug, Deserialize)]
pub struct FirebaseConfig {
    pub project_id:     String,
    pub private_key_id: String,
    pub private_key:    String,
    pub client_email:   String,
    pub client_id:      String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Eq, PartialEq)]
pub struct Jwk {
    pub e:   String,
    pub alg: String,
    pub kty: String,
    pub kid: String,
    pub n:   String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct KeysResponse {
    pub keys: Vec<Jwk>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Jwt {
    pub aud: String,
    pub iat: u64,
    pub exp: u64,
    pub sub: String,
}

#[derive(Debug)]
pub enum AuthError {
    JwtError(String),
    FetchError(String),
}

impl From<jsonwebtoken::errors::Error> for AuthError {
    fn from(e: jsonwebtoken::errors::Error) -> Self {
        AuthError::JwtError(format!("Auth error occurred: {:?}", e))
    }
}

impl From<reqwest::Error> for AuthError {
    fn from(e: reqwest::Error) -> Self {
        AuthError::FetchError(format!("Auth error occurred: {:?}", e))
    }
}

pub struct JwtConfig {
    pub jwks_url: String,
}

pub static FIREBASE_AUTHENTICATION_AUDIENCE: &str =
    "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

pub fn create_custom_token(uid: &str) -> Result<String, AuthError> {
    let firebase_config = FirebaseConfig::new();

    Jwt::encode(
        FIREBASE_AUTHENTICATION_AUDIENCE,
        firebase_config.private_key_id,
        firebase_config.private_key,
        uid.to_string(),
    )
}

#[derive(Debug)]
pub struct BearerToken(pub String);

fn is_valid(header: &str) -> bool {
    let parts = header.trim().split(' ').collect::<Vec<&str>>();
    parts.len() == 2 && parts[0] == "Bearer" && parts[1].len() > 1
}

fn get_bearer_token(header: &str) -> BearerToken {
    if header.len() >= 7 {
        BearerToken(header.to_string()[7..].to_string())
    } else {
        BearerToken("".to_string())
    }
}

#[derive(Debug)]
pub enum BearerTokenError {
    BadCount,
    Missing,
    Invalid,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for BearerToken {
    type Error = BearerTokenError;

    async fn from_request(
        request: &'r Request<'_>,
    ) -> request::Outcome<Self, Self::Error> {
        let auth_headers = request
            .headers()
            .get("Authorization")
            .collect::<Vec<&str>>();

        match auth_headers.len() {
            0 => Outcome::Failure((
                Status::BadRequest,
                BearerTokenError::Missing,
            )),
            1 if is_valid(auth_headers[0]) => {
                Outcome::Success(get_bearer_token(auth_headers[0]))
            }
            1 => Outcome::Failure((
                Status::BadRequest,
                BearerTokenError::Invalid,
            )),
            _ => Outcome::Failure((
                Status::BadRequest,
                BearerTokenError::BadCount,
            )),
        }
    }
}
