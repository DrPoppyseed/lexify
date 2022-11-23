use rocket::{
    http::ContentType,
    local::asynchronous::{Client, LocalResponse},
};

use lexify_server::api;

use crate::common::{
    utils::auth_header, COL_DESC, COL_ID, COL_NAME, USER_ID, VW_DEF, VW_ID,
    VW_WORD,
};

// User
#[allow(dead_code)]
pub async fn call_get_or_create_user(client: &Client) -> LocalResponse {
    let req_body = api::User {
        id: USER_ID.to_string(),
    };

    let req = client
        .post("/users")
        .header(ContentType::JSON)
        .json(&req_body);

    req.dispatch().await
}

// Vocab words
#[allow(dead_code)]
pub async fn call_create_vocab_word(client: &Client) -> LocalResponse {
    let req_body = api::VocabWord {
        id: VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word: VW_WORD.to_string(),
        definition: VW_DEF.to_string(),
        fails: 0,
        successes: 0,
        priority: 1,
    };

    client
        .post("/vocab_words")
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_update_vocab_word(client: &Client) -> LocalResponse {
    let req_body = api::VocabWord {
        id: VW_ID.to_string(),
        collection_id: COL_ID.to_string(),
        word: "updated test word".to_string(),
        definition: "updated test definition".to_string(),
        fails: 2,
        successes: 3,
        priority: 1,
    };

    client
        .put("/vocab_words")
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_get_vocab_words(client: &Client) -> LocalResponse {
    client
        .get(format!("/vocab_words/{COL_ID}"))
        .header(auth_header(USER_ID))
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_update_vocab_words(
    client: &Client,
    vocab_words: Vec<api::VocabWord>,
) -> LocalResponse {
    client
        .put(format!("/vocab_words/{COL_ID}"))
        .header(auth_header(USER_ID))
        .json(&vocab_words)
        .dispatch()
        .await
}

// Collections
#[allow(dead_code)]
pub async fn call_create_collection(client: &Client) -> LocalResponse {
    let req_body = api::Collection {
        id: COL_ID.to_string(),
        user_id: USER_ID.to_string(),
        name: COL_NAME.to_string(),
        description: Some(COL_DESC.to_string()),
        priority: 0,
    };

    client
        .post("/collections")
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_get_collections(client: &Client) -> LocalResponse {
    client
        .get("/collections")
        .header(auth_header(USER_ID))
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_update_collection(client: &Client) -> LocalResponse {
    let req_body = api::Collection {
        id: COL_ID.to_string(),
        user_id: USER_ID.to_string(),
        name: "updated test name".to_string(),
        description: Some("updated test description".to_string()),
        priority: 0,
    };

    client
        .put(format!("/collections/{COL_ID}"))
        .header(auth_header(USER_ID))
        .json(&req_body)
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_get_collection(client: &Client) -> LocalResponse {
    client
        .get(format!("/collections/{COL_ID}"))
        .header(auth_header(USER_ID))
        .dispatch()
        .await
}

#[allow(dead_code)]
pub async fn call_update_collections(
    client: &Client,
    collections: Vec<api::Collection>,
) -> LocalResponse {
    client
        .put("/collections")
        .header(auth_header(USER_ID))
        .json(&collections)
        .dispatch()
        .await
}
