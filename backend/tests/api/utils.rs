use rocket::local::asynchronous::Client;
use wiremock::MockServer;

use lexify_api::rocket_launch::{
    establish_connection_pool,
    rocket_launch,
    DbPool,
};

pub async fn setup() -> (DbPool, Client, MockServer) {
    let db_pool = establish_connection_pool(".env.test");

    let rocket = rocket_launch(db_pool.clone()).await;

    let client = Client::untracked(rocket)
        .await
        .expect("Failed to launch local rocket server instance.");

    let mock_server = MockServer::start().await;

    (db_pool, client, mock_server)
}
