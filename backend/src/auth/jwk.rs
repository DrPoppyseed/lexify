use std::collections::HashMap;

use crate::auth::{Jwk, KeysResponse};

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
