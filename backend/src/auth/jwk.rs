use std::collections::HashMap;

use futures::TryFutureExt;

use crate::auth::{Jwk, KeysResponse};

pub async fn get_firebase_jwks(
    jwks_url: &str,
) -> Result<HashMap<String, Jwk>, reqwest::Error> {
    reqwest::get(jwks_url)
        .and_then(|resp| resp.json::<KeysResponse>())
        .map_ok(|resp| {
            let key_map = resp.keys.iter().fold(
                HashMap::<String, Jwk>::new(),
                move |mut key_map, key| {
                    key_map.insert(key.kid.clone(), key.clone());
                    key_map
                },
            );

            Ok(key_map)
        })
        .await?
}
