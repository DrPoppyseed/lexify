use rocket_firebase_auth::jwk::{Jwk, KeysResponse};
use serde_json::json;
use wiremock::{
    matchers::{method, path},
    Mock,
    ResponseTemplate,
};

#[allow(dead_code)]
static JWK_N: &str = "qPSOdIwB1PidjFSY_dLckUu1Y4rPnP5nvOtMy_wMToekETe-h3P_FGVh_OA8E1J6stkeoWpqigfzuMIA6Ccc5BGC-xrt3jYgWSGtES8dKrPLjSFRmKOGk6IuosGvILpNRT-a9gocZOnRDGU9sE04vM2OfLQVc9kk-7tCWIirbu58DkpTYySZMaq-qLrbNUZg8w9MGZ0_wQabhiGaM1wfFJ9lV6uqL4CPkcdMvhaTQMV7lZStbApYUFiPBzIeKW6jrfB-dlkk08g_eluPkQHlHEGtH_5pTnBm9RIwzhHhP4hddc6LzdWAVfDe2DPrrFDfmUv45ejkIf4wmAreodjfPw";

#[allow(dead_code)]
pub fn mock_jwk_issuer() -> Mock {
    let jwk = Jwk::new("test_private_key_id", JWK_N);
    Mock::given(method("GET"))
        .and(path("/jwks_url"))
        .respond_with(
            ResponseTemplate::new(200)
                .set_body_json(json!(KeysResponse { keys: vec![jwk] })),
        )
        .expect(1)
}
