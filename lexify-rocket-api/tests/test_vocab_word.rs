use std::time::Duration;

use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::http::Status;
use tokio::time::sleep;

use common::{mocks::mock_jwk_issuer, utils::setup};
use lexify_rocket_api::{api, db};

use crate::common::{
    calls::{
        call_create_collection,
        call_create_vocab_word,
        call_get_vocab_words,
        call_update_vocab_word,
        call_update_vocab_words,
    },
    COL_ID,
    VW_DEF,
    VW_ID,
    VW_WORD,
};

mod common;

#[rocket::async_test]
async fn get_vocab_words_happy_path() {
    let (_, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(3).mount(&mock_server).await;

    call_create_collection(&client).await;
    call_create_vocab_word(&client).await;
    let res = call_get_vocab_words(&client).await;

    assert_eq!(res.status(), Status { code: 200 });

    let res_body = res.into_json::<Vec<api::VocabWord>>().await.unwrap();
    let _desired_body = vec![api::VocabWord {
        id:            VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word:          VW_WORD.to_string(),
        definition:    VW_DEF.to_string(),
        fails:         0,
        successes:     0,
        priority:      1,
    }];

    assert!(matches!(res_body, _desired_body));
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

    let _desired_body = api::VocabWord {
        id:            VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word:          "updated test word".to_string(),
        definition:    VW_DEF.to_string(),
        fails:         2,
        successes:     3,
        priority:      1,
    };

    assert!(matches!(vocab_word_in_db, _desired_body));
}

#[rocket::async_test]
async fn update_vocab_words_happy_path() {
    let (db_pool, client, mock_server) = setup().await;

    mock_jwk_issuer().expect(3).mount(&mock_server).await;

    let vocab_words = vec![
        api::VocabWord {
            id:            VW_ID.to_string(),
            collection_id: COL_ID.to_string(),
            word:          VW_WORD.to_string(),
            definition:    VW_DEF.to_string(),
            fails:         2,
            successes:     3,
            priority:      1,
        },
        api::VocabWord {
            id:            "another_test_id".to_string(),
            collection_id: COL_ID.to_string(),
            word:          "another_test_word".to_string(),
            definition:    "another_test_def".to_string(),
            fails:         0,
            successes:     0,
            priority:      1,
        },
    ];

    call_create_collection(&client).await;
    call_create_vocab_word(&client).await;
    sleep(Duration::from_secs(2)).await;
    let res = call_update_vocab_words(&client, vocab_words).await;

    assert_eq!(res.status(), Status { code: 200 });

    let mut conn = db_pool.get().unwrap();
    let vocab_words_in_db: Vec<db::VocabWord> = conn
        .transaction(|conn| {
            db::schema::vocab_words::dsl::vocab_words
                .filter(db::schema::vocab_words::collection_id.eq(COL_ID))
                .get_results(conn)
        })
        .unwrap();

    assert_eq!(vocab_words_in_db.len(), 2);

    let updated_vocab_word = vocab_words_in_db
        .iter()
        .find(|vocab_word| vocab_word.id == VW_ID);

    // Check if vocab words with the same key get updated in place in the DB
    assert!(updated_vocab_word.is_some());

    let updated_vocab_word = updated_vocab_word.unwrap();
    assert_ne!(updated_vocab_word.updated_at, updated_vocab_word.created_at);
}
