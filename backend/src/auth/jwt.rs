use chrono::Utc;
use jsonwebtoken::{
    decode_header,
    errors::ErrorKind,
    Algorithm,
    DecodingKey,
    EncodingKey,
    Header,
    Validation,
};

use crate::auth::{jwk::get_firebase_jwks, FirebaseConfig, Jwt};

impl Jwt {
    pub fn new(audience: &str, uid: String) -> Self {
        let iat = Utc::now().timestamp() as u64;
        Jwt {
            aud: audience.to_string(),
            iat,
            exp: iat + (60 * 60),
            sub: uid,
        }
    }

    pub fn encode(
        audience: &str,
        private_key_id: String,
        private_key: String,
        uid: String,
    ) -> Result<String, jsonwebtoken::errors::Error> {
        let mut header = Header::new(Algorithm::RS256);
        header.kid = Some(private_key_id);

        let claims = Self::new(audience, uid);
        let pem = str::as_bytes(&private_key);
        let secret_key = EncodingKey::from_rsa_pem(pem);
        match secret_key {
            Ok(key) => jsonwebtoken::encode(&header, &claims, &key),
            Err(err) => Err(err),
        }
    }

    pub async fn verify(
        token: &str,
        firebase_config: &FirebaseConfig,
    ) -> Result<jsonwebtoken::TokenData<Jwt>, jsonwebtoken::errors::Error> {
        let kid = match decode_header(token).map(|header| header.kid) {
            Ok(Some(k)) => k,
            Ok(None) => {
                return Err(jsonwebtoken::errors::Error::from(
                    ErrorKind::InvalidToken,
                ));
            }
            Err(err) => return Err(err),
        };
        let jwks = get_firebase_jwks().await.unwrap();
        let jwk = jwks.get(&kid).unwrap();

        let mut validation = Validation::new(Algorithm::RS256);
        validation.set_issuer(&[format!(
            "https://securetoken.google.com/{}",
            &firebase_config.project_id
        )]);

        validation.set_audience(&[&firebase_config.project_id]);

        let key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)?;
        jsonwebtoken::decode::<Jwt>(token, &key, &validation)
    }
}
