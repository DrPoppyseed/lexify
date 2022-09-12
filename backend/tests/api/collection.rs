use std::ops::Deref;

use diesel::{Connection, QueryDsl, RunQueryDsl};
use rocket::http::{ContentType, Status};

use lexify_api::{api, db};

use crate::utils::setup;

static USER_ID: &str = "dummy_user_id";
static COL_ID: &str = "dummy_collection_id";
static COL_NAME: &str = "dummy_collection_name";
static COL_DESC: &str = "dummy_collection_description";

#[ignore]
#[rocket::async_test]
async fn create_collection_happy_path() {
    let (db_pool, client, _) = setup().await;

    let req_body = api::Collection {
        id:          COL_ID.to_string(),
        user_id:     USER_ID.to_string(),
        name:        COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
    };

    let req = client
        .post("/collections")
        .header(ContentType::JSON)
        .json(&req_body);

    let res = req.dispatch().await;

    assert!(res.body().is_none());
    assert_eq!(res.status(), Status { code: 201 });

    let conn = db_pool.get().unwrap();
    let collection_in_db = conn
        .transaction(|| {
            db::schema::collections::dsl::collections
                .find(COL_ID)
                .get_result::<db::Collection>(conn.deref())
        })
        .unwrap();

    assert_eq!(collection_in_db.id, COL_ID);
    assert_eq!(collection_in_db.user_id, USER_ID);
}
