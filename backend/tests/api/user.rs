use std::ops::Deref;

use diesel::{connection::SimpleConnection, Connection, QueryDsl, RunQueryDsl};
use rocket::{
    http::{ContentType, Status},
    local::asynchronous::{Client, LocalResponse},
};

use lexify_api::{api, db};

use crate::utils::setup;

static USER_ID: &str = "dummy_user_id";

async fn call_get_or_create_user(client: &Client) -> LocalResponse {
    let req_body = api::User {
        id: USER_ID.to_string(),
    };

    let req = client
        .post("/users")
        .header(ContentType::JSON)
        .json(&req_body);

    req.dispatch().await
}

#[rocket::async_test]
async fn create_user_happy_path() {
    let (db_pool, client, _) = setup().await;

    let res = call_get_or_create_user(&client).await;
    assert_eq!(res.status(), Status { code: 201 });

    let res_body = res.into_json::<api::User>().await.unwrap();
    assert_eq!(res_body.id, USER_ID);

    let conn = db_pool.get().unwrap();
    let user_in_db = conn
        .transaction(|| {
            db::schema::users::dsl::users
                .find(USER_ID)
                .get_result::<db::User>(conn.deref())
        })
        .unwrap();
    assert_eq!(user_in_db.id, USER_ID);
}

#[rocket::async_test]
async fn get_user() {
    let (db_pool, client, _) = setup().await;
    let conn = db_pool.get().unwrap();

    conn.batch_execute(&format!(
        "INSERT INTO users VALUES ('{USER_ID}', NOW(), NOW());"
    ))
    .unwrap();

    let res = call_get_or_create_user(&client).await;
    assert_eq!(res.status(), Status { code: 200 });

    let res_body = res.into_json::<api::User>().await.unwrap();
    assert_eq!(res_body.id, USER_ID);
}
