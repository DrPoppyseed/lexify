use std::env;

use dotenv::dotenv;

use crate::auth::FirebaseConfig;

impl FirebaseConfig {
    pub fn new() -> FirebaseConfig {
        dotenv().ok();

        let firebase_admin_certs = env::var("FIREBASE_ADMIN_CERTS").expect(
            "Error: failed to retrieve env variable. Could not setup firebase configuration.");

        serde_json::from_str::<FirebaseConfig>(firebase_admin_certs.as_str())
            .expect("Error: failed to parse firebase config.")
    }
}
