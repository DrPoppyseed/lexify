use diesel::{Connection, QueryDsl, RunQueryDsl};
use rocket::{
    http::{Header, Status},
    local::asynchronous::{Client, LocalResponse},
};
use serde::Serialize;

use lexify_api::{api, db};

use crate::{
    mocks::mock_jwk_issuer,
    utils::{create_valid_bearer_token, setup},
};

static USER_ID: &str = "test_user_id";
static COL_ID: &str = "test_collection_id";
static COL_NAME: &str = "test_collection_name";
static COL_DESC: &str = "test_collection_description";

#[derive(Serialize)]
pub struct TestJwks {
    jwks: Vec<String>,
}

fn auth_header() -> Header<'static> {
    Header::new(
        "Authorization",
        format!("Bearer {}", create_valid_bearer_token(USER_ID.to_string())),
    )
}

async fn call_create_collection(client: &Client) -> LocalResponse {
    let req_body = api::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
    };

    client
        .post("/collections")
        .header(auth_header())
        .json(&req_body)
        .dispatch()
        .await
}

async fn call_get_collections(client: &Client) -> LocalResponse {
    client
        .get("/collections")
        .header(auth_header())
        .dispatch()
        .await
}

async fn call_update_collection(client: &Client) -> LocalResponse {
    let req_body = api::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        "updated test name".to_string(),
        description: Some("updated test description".to_string()),
    };

    client
        .put("/collections")
        .header(auth_header())
        .json(&req_body)
        .dispatch()
        .await
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
