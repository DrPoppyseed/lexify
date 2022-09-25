use diesel::{Connection, QueryDsl, RunQueryDsl};
use rocket::{
    http::Status,
    local::asynchronous::{Client, LocalResponse},
};

use lexify_api::{api, db};

use crate::{
    collection::call_create_collection,
    mocks::mock_jwk_issuer,
    utils::{auth_header, setup},
};

static USER_ID: &str = "test_user_id";
static COL_ID: &str = "test_collection_id";
static VW_ID: &str = "test_vocab_word_id";
static VW_WORD: &str = "test_vocab_word_word";
static VW_DEF: &str = "test_vocab_word_definition";

pub async fn call_create_vocab_word(client: &Client) -> LocalResponse {
    let req_body = api::VocabWord {
        id:            VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word:          VW_WORD.to_string(),
        definition:    VW_DEF.to_string(),
        fails:         0,
        successes:     0,
    };

    client
        .post("/vocab_words")
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

async fn call_update_vocab_word(client: &Client) -> LocalResponse {
    let req_body = api::VocabWord {
        id:            VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word:          "updated test word".to_string(),
        definition:    "updated test definition".to_string(),
        fails:         2,
        successes:     3,
    };

    client
        .put("/vocab_words")
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

async fn call_get_vocab_words(client: &Client) -> LocalResponse {
    client
        .get(format!("/vocab_words/{COL_ID}"))
        .header(auth_header(USER_ID))
        .dispatch()
        .await
}

#[rocket::async_test]
async fn get_vocab_words_happy_path() {
    let (_, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(3).mount(&mock_server).await;

    call_create_collection(&client).await;
    call_create_vocab_word(&client).await;
    let res = call_get_vocab_words(&client).await;

    assert_eq!(res.status(), Status { code: 200 });

    let res_body = res.into_json::<Vec<api::VocabWord>>().await.unwrap();
    let desired_body = vec![api::VocabWord {
        id:            VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word:          VW_WORD.to_string(),
        definition:    VW_DEF.to_string(),
        fails:         0,
        successes:     0,
    }];

    assert!(matches!(res_body, desired_body));
}

#[rocket::async_test]
async fn insert_vocab_word_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(1).mount(&mock_server).await;

    let res = call_create_vocab_word(&client).await;

    assert!(res.body().is_some());
    assert_eq!(res.status(), Status { code: 201 });

    let mut conn = db_pool.get().unwrap();
    let vocab_word_in_db: db::VocabWord = conn
        .transaction(|conn| {
            db::schema::vocab_words::dsl::vocab_words
                .find(VW_ID)
                .get_result::<db::VocabWord>(conn)
        })
        .unwrap();

    assert_eq!(vocab_word_in_db.id, VW_ID.to_string());
    assert_eq!(vocab_word_in_db.collection_id, COL_ID.to_string());
}

#[rocket::async_test]
async fn update_vocab_word_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(2).mount(&mock_server).await;

    call_create_vocab_word(&client).await;
    call_update_vocab_word(&client).await;

    let mut conn = db_pool.get().unwrap();
    let vocab_word_in_db: db::VocabWord = conn
        .transaction(|conn| {
            db::schema::vocab_words::dsl::vocab_words
                .find(VW_ID)
                .get_result::<db::VocabWord>(conn)
        })
        .unwrap();

    assert_eq!(vocab_word_in_db.id, VW_ID.to_string());
    assert_eq!(vocab_word_in_db.collection_id, COL_ID.to_string());
    assert_eq!(vocab_word_in_db.word, "updated test word".to_string());
    assert_eq!(vocab_word_in_db.fails, 2);
}
