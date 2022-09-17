use rocket::{Build, Rocket};

use lexify_api::{
    auth::{FirebaseConfig, JwtConfig},
    rocket_launch::{establish_connection_pool, rocket_launch, ServerState},
};

#[rocket::launch]
async fn rocket() -> Rocket<Build> {
    let db_pool = establish_connection_pool(".env");
    let firebase_admin = FirebaseConfig::new();
    let jwt_config = JwtConfig::new();

    rocket_launch(ServerState {
        db_pool,
        firebase_admin,
        jwt_config,
    })
    .await
}
