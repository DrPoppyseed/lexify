use diesel::{connection::SimpleConnection, Connection, QueryDsl, RunQueryDsl};
use rocket::http::Status;

use lexify_rocket_api::{api, db};

use crate::common::{calls::call_get_or_create_user, utils::setup, USER_ID};

mod common;

#[rocket::async_test]
async fn create_user_happy_path() {
    let (db_pool, client, _) = setup().await;

    let res = call_get_or_create_user(&client).await;
    assert_eq!(res.status(), Status { code: 201 });

    let res_body = res.into_json::<api::User>().await.unwrap();
    assert_eq!(res_body.id, USER_ID);

    let mut conn = db_pool.get().unwrap();
    let user_in_db = conn
        .transaction(|conn| {
            db::schema::users::dsl::users
                .find(USER_ID)
                .get_result::<db::User>(conn)
        })
        .unwrap();
    assert_eq!(user_in_db.id, USER_ID);
}

#[rocket::async_test]
async fn get_user() {
    let (db_pool, client, _) = setup().await;

    let mut conn = db_pool.get().unwrap();
    conn.batch_execute(&format!(
        "INSERT INTO users VALUES ('{USER_ID}', NOW(), NOW());"
    ))
    .unwrap();

    let res = call_get_or_create_user(&client).await;
    assert_eq!(res.status(), Status { code: 200 });

    let res_body = res.into_json::<api::User>().await.unwrap();
    assert_eq!(res_body.id, USER_ID);
}
