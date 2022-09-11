use std::ops::Deref;

use diesel::{connection::SimpleConnection, Connection, QueryDsl, RunQueryDsl};
use rocket::http::{ContentType, Status};

use lexify_api::{
    api::collection,
    db::{mysql, schema::collections::dsl::collections},
    rocket_launch::DbPool,
};

use crate::utils::setup;

static USER_ID: &str = "dummy_user_id";
static COL_ID: &str = "dummy_collection_id";
static COL_NAME: &str = "dummy_collection_name";
static COL_DESC: &str = "dummy_collection_description";

async fn before_each(db_pool: &DbPool) -> Result<(), mysql::StorageError> {
    let conn = db_pool.get().map_err(mysql::StorageError::from)?;

    conn.batch_execute(
        r#"
    DROP TABLE IF EXISTS collections;
    "#,
    )
    .expect("Failed to execute cleanup scripts for database");

    let migration = tokio::fs::read_to_string("./migrations/migrate.sql")
        .await
        .expect("Failed to read the migration file.");

    conn.batch_execute(migration.as_str())
        .expect("Failed to run migrations after cleanup.");

    Ok(())
}

#[ignore]
#[rocket::async_test]
async fn create_collection_happy_path() {
    let (db_pool, client, _) = setup().await;
    let _cleanup = before_each(&db_pool).await;

    let req_body = collection::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
    };

    let req = client
        .post("/collection/collections")
        .header(ContentType::JSON)
        .json(&req_body);

    let res = req.dispatch().await;

    assert!(res.body().is_none());
    assert_eq!(res.status(), Status { code: 201 });

    let conn = db_pool.get().unwrap();
    let db = conn
        .transaction(|| {
            collections
                .find(COL_ID)
                .load::<mysql::Collection>(conn.deref())
        })
        .unwrap();

    assert_eq!(db[0].id, COL_ID);
    assert_eq!(db[0].user_id, USER_ID);
}
