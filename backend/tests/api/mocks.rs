use std::env;

use serde_json::json;
use wiremock::{
    matchers::{method, path},
    Mock,
    ResponseTemplate,
};

use lexify_api::auth::{Jwk, KeysResponse};

pub fn mock_jwk_issuer() -> Mock {
    dotenv::from_filename(".env.test").ok();

    let jwk_n = env::var("JWK_N")
        .expect("Error: failed to retrieve env variable JWK_N.");

    let jwk = Jwk {
        e:   "AQAB".to_string(),
        alg: "RS256".to_string(),
        kty: "RSA".to_string(),
        kid: "test_private_key_id".to_string(),
        n:   jwk_n,
    };

    Mock::given(method("GET"))
        .and(path("/jwks_url"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_json(json!(KeysResponse { keys: vec![jwk] })),
        )
        .expect(1)
}
