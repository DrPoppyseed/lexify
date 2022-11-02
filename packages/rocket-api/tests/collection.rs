use std::time::Duration;

use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::http::Status;
use serde::Serialize;
use tokio::time::sleep;

use lexify_api::{api, db};

use crate::common::{
    calls::{
        call_create_collection,
        call_get_collection,
        call_get_collections,
        call_update_collection,
        call_update_collections,
    },
    mocks::mock_jwk_issuer,
    utils::setup,
    COL_DESC,
    COL_ID,
    COL_NAME,
    USER_ID,
};

mod common;

#[derive(Serialize)]
pub struct TestJwks {
    jwks: Vec<String>,
}

#[rocket::async_test]
async fn create_collection_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(1).mount(&mock_server).await;

    let res = call_create_collection(&client).await;

    assert!(res.body().is_none());
    assert_eq!(res.status(), Status { code: 201 });

    let mut conn = db_pool.get().unwrap();
    let collection_in_db = conn
        .transaction(|conn| {
            db::schema::collections::dsl::collections
                .find(COL_ID)
                .get_result::<db::Collection>(conn)
        })
        .unwrap();

    assert_eq!(collection_in_db.id, COL_ID);
    assert_eq!(collection_in_db.user_id, USER_ID);
}

#[rocket::async_test]
async fn get_collections_happy_path() {
    let (_, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(2).mount(&mock_server).await;

    call_create_collection(&client).await;
    let res = call_get_collections(&client).await;

    assert_eq!(res.status(), Status { code: 200 });

    let body = res.into_json::<Vec<api::Collection>>().await.unwrap();

    let desired_body = api::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
        priority:    0,
    };

    assert_eq!(&body.len(), &1usize);
    assert_eq!(body[0], desired_body);
}

#[rocket::async_test]
async fn update_collection_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(2).mount(&mock_server).await;
    call_create_collection(&client).await;
    call_update_collection(&client).await;

    let mut conn = db_pool.get().unwrap();
    let collection_in_db = conn
        .transaction(|conn| {
            db::schema::collections::dsl::collections
                .find(COL_ID)
                .get_result::<db::Collection>(conn)
        })
        .unwrap();

    assert_eq!(collection_in_db.id, COL_ID);
    assert_eq!(
        collection_in_db.description,
        Some("updated test description".to_string())
    );
    assert_eq!(collection_in_db.name, "updated test name".to_string())
}

#[rocket::async_test]
async fn get_collection_happy_path() {
    let (_, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(2).mount(&mock_server).await;
    call_create_collection(&client).await;
    let res = call_get_collection(&client).await;
    let res_body = res.into_json::<api::Collection>().await.unwrap();

    let desired_body = api::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
        priority:    0,
    };

    assert_eq!(res_body, desired_body);
}

#[rocket::async_test]
async fn update_collections_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(2).mount(&mock_server).await;

    let collections = vec![
        api::Collection {
            id:          COL_ID.to_string(),
            user_id:     USER_ID.to_string(),
            name:        COL_NAME.to_string(),
            description: Some(COL_DESC.to_string()),
            priority:    0,
        },
        api::Collection {
            id:          "another_col_id".to_string(),
            user_id:     USER_ID.to_string(),
            name:        "another_col_name".to_string(),
            description: Some("another_desc".to_string()),
            priority:    1,
        },
    ];

    call_create_collection(&client).await;
    sleep(Duration::from_secs(2)).await;
    let res = call_update_collections(&client, collections).await;

    assert_eq!(res.status(), Status { code: 200 });

    let mut conn = db_pool.get().unwrap();
    let collections_in_db: Vec<db::Collection> = conn
        .transaction(|conn| {
            db::schema::collections::dsl::collections
                .filter(db::schema::collections::user_id.eq(USER_ID))
                .get_results(conn)
        })
        .unwrap();

    assert_eq!(collections_in_db.len(), 2);

    let updated_collection = collections_in_db
        .iter()
        .find(|collection| collection.id == COL_ID);

    assert!(updated_collection.is_some());

    let updated_collection = updated_collection.unwrap();
    assert_ne!(updated_collection.updated_at, updated_collection.created_at);
}
