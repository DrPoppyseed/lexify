use rocket::http::ContentType;

use lexify_api::api::collection::Collection;

use crate::utils::setup;

static USER_ID: &str = "dummy_user_id";
static COL_ID: &str = "dummy_collection_id";
static COL_NAME: &str = "dummy_collection_name";
static COL_DESC: &str = "dummy_collection_description";

#[rocket::async_test]
#[ignore]
async fn create_collection_happy_path() {
    let (_db_pool, client, _mock_server) = setup().await;

    let req_body = Collection {
        id:          COL_ID.to_string(),
        user_id:     Some(USER_ID.to_string()),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
    };
    let serd_req_body = bincode::serialize(&req_body).unwrap();
    let req = client
        .post("/collection/collections")
        .header(ContentType::JSON)
        .json(&serd_req_body);

    let res = req.dispatch().await;

    assert!(res.body().is_some());
}
