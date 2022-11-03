use diesel::connection::SimpleConnection;
use once_cell::sync::Lazy;
use rocket::{http::Header, local::asynchronous::Client};
use rocket_firebase_auth::auth::FirebaseAuth;
use wiremock::MockServer;

use lexify_core::rocket_launch::{
    establish_connection_pool,
    rocket_launch,
    DbPool,
    ServerState,
};

pub static FIREBASE_AUTH: Lazy<FirebaseAuth> = Lazy::new(|| {
    FirebaseAuth::try_from_env_with_filename(
        ".env.test",
        "FIREBASE_ADMIN_CERTS",
    )
    .unwrap()
});

pub async fn setup() -> (DbPool, Client, MockServer) {
    let db_pool = establish_connection_pool(".env.test");
    cleanup(&db_pool).await;

    let auth = FirebaseAuth::try_from_env_with_filename(
        ".env.test",
        "FIREBASE_ADMIN_CERTS",
    )
    .unwrap()
    .set_jwks_url("http://localhost:8888/jwks_url");

    let rocket = rocket_launch(ServerState {
        db_pool: db_pool.clone(),
        auth,
    })
    .await;

    let client = Client::untracked(rocket).await.unwrap();

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
    DROP TABLE IF EXISTS vocab_words;
    "#,
    )
    .expect("Failed to execute cleanup scripts for database");

    let migration = tokio::fs::read_to_string("migrations/migrate.sql")
        .await
        .expect("Failed to read the migration file.");

    conn.batch_execute(migration.as_str())
        .expect("Failed to run migrations after cleanup.");
}

pub fn auth_header(user_id: &str) -> Header<'static> {
    let token = &FIREBASE_AUTH.encode(user_id).unwrap().0;
    Header::new("Authorization", format!("Bearer {token}"))
}
