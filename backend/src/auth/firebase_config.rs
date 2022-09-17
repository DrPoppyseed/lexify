use std::env;

use crate::auth::FirebaseConfig;

impl FirebaseConfig {
    pub fn new() -> Self {
        Self::from_env_filename(".env")
    }

    pub fn from_env_filename(env_filename: &str) -> Self {
        dotenv::from_filename(env_filename).ok();

        let firebase_admin_certs = env::var("FIREBASE_ADMIN_CERTS").expect(
            "Error: failed to retrieve env variable. Could not setup firebase configuration.");

        serde_json::from_str::<FirebaseConfig>(firebase_admin_certs.as_str())
            .expect("Error: failed to parse firebase config.")
    }
}

impl Default for FirebaseConfig {
    fn default() -> Self {
        Self::new()
    }
}
