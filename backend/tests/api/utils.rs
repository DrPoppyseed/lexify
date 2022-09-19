use diesel::connection::SimpleConnection;
use rocket::local::asynchronous::Client;
use wiremock::MockServer;

use lexify_api::{
    auth::{FirebaseConfig, Jwt, JwtConfig},
    rocket_launch::{
        establish_connection_pool,
        rocket_launch,
        DbPool,
        ServerState,
    },
};

pub async fn setup() -> (DbPool, Client, MockServer) {
    let db_pool = establish_connection_pool(".env.test");
    cleanup(&db_pool).await;

    let firebase_admin = FirebaseConfig::from_env_filename(".env.test");
    let jwt_config = JwtConfig::from_env_filename(".env.test");

    let rocket = rocket_launch(ServerState {
        db_pool: db_pool.clone(),
        firebase_admin,
        jwt_config,
    })
    .await;

    let client = Client::untracked(rocket)
        .await
        .expect("Failed to launch local rocket server instance.");

    let listener = std::net::TcpListener::bind("127.0.0.1:8888").unwrap();
    let mock_server = MockServer::builder().listener(listener).start().await;

    (db_pool, client, mock_server)
}

async fn cleanup(db_pool: &DbPool) {
    let mut conn = db_pool.get().unwrap();

    conn.batch_execute(
        r#"
    DROP TABLE IF EXISTS collections;
    DROP TABLE IF EXISTS users;
    "#,
    )
    .expect("Failed to execute cleanup scripts for database");

    let migration = tokio::fs::read_to_string("./migrations/migrate.sql")
        .await
        .expect("Failed to read the migration file.");

    conn.batch_execute(migration.as_str())
        .expect("Failed to run migrations after cleanup.");
}

pub fn create_valid_bearer_token(uid: String) -> String {
    let private_key = FirebaseConfig::new().private_key;

    Jwt::encode(
        "lexify_test",
        "test_private_key_id".to_string(),
        private_key,
        uid,
    )
    .unwrap()
}
