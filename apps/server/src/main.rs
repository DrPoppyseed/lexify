use rocket::{Build, Rocket};
use rocket_firebase_auth::auth::FirebaseAuth;

use lexify_server::rocket_launch::{
    establish_connection_pool,
    rocket_launch,
    ServerState,
};

#[rocket::launch]
async fn rocket() -> Rocket<Build> {
    let db_pool = establish_connection_pool(".env");
    let auth = FirebaseAuth::try_from_env("FIREBASE_ADMIN_CERTS")
        .expect("Failed to load firebase credentials");

    rocket_launch(ServerState { db_pool, auth }).await
}
