use diesel::connection::SimpleConnection;
use rocket::local::asynchronous::Client;
use wiremock::MockServer;

use lexify_api::rocket_launch::{
    establish_connection_pool,
    rocket_launch,
    DbPool,
};

pub async fn setup() -> (DbPool, Client, MockServer) {
    let db_pool = establish_connection_pool(".env.test");
    cleanup(&db_pool).await;

    let rocket = rocket_launch(db_pool.clone()).await;

    let client = Client::untracked(rocket)
        .await
        .expect("Failed to launch local rocket server instance.");

    let mock_server = MockServer::start().await;

    (db_pool, client, mock_server)
}

async fn cleanup(db_pool: &DbPool) {
    let conn = db_pool.get().unwrap();

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
