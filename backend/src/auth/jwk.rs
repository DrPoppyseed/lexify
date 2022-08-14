use std::collections::HashMap;

use serde::Deserialize;

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

pub async fn get_firebase_jwks() -> Result<HashMap<String, Jwk>, reqwest::Error>
{
    let url =
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
    let resp = reqwest::get(url).await?.json::<KeysResponse>().await?;

    let mut key_map = HashMap::new();
    for key in resp.keys {
        key_map.insert(key.kid.clone(), key);
    }
    Ok(key_map)
}
