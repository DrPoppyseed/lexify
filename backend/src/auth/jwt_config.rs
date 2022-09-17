use std::env;

use crate::auth::JwtConfig;

impl JwtConfig {
    pub fn new() -> Self {
        Self::from_env_filename(".env")
    }

    pub fn from_env_filename(env_filename: &str) -> Self {
        dotenv::from_filename(env_filename).ok();

        let jwks_url = env::var("JWKS_URL").expect("Error: failed to retrieve env variable. Could not setup jwt configuration.");

        JwtConfig { jwks_url }
    }
}

impl Default for JwtConfig {
    fn default() -> Self {
        Self::new()
    }
}
