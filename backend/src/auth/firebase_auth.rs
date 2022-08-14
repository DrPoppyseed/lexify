use dotenv::dotenv;
use serde::Deserialize;
use std::env;

#[derive(Clone, Debug, Deserialize)]
pub struct FirebaseConfig {
    pub project_id:     String,
    pub private_key_id: String,
    pub private_key:    String,
    pub client_email:   String,
    pub client_id:      String,
}

impl FirebaseConfig {
    pub fn new() -> FirebaseConfig {
        dotenv().ok();

        let firebase_admin_certs = env::var("FIREBASE_ADMIN_CERTS").expect(
            "Error: failed to retrieve env variable. Could not setup firebase configuration.");

        serde_json::from_str::<FirebaseConfig>(firebase_admin_certs.as_str())
            .expect("Error: failed to parse firebase config.")
    }
}
