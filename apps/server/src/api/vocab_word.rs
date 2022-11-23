use futures::TryFutureExt;
use rocket::{
    get, http::Status, post, put, routes, serde::json::Json, Route, State,
};
use rocket_firebase_auth::bearer_token::BearerToken;
use tracing::info;

use crate::{api, db, http_error::HttpError, rocket_launch::ServerState};

pub fn routes() -> Vec<Route> {
    routes![
        get_vocab_words,
        create_vocab_word,
        update_vocab_word,
        update_vocab_words,
    ]
}

#[get("/<collection_id>")]
pub async fn get_vocab_words(
    collection_id: &str,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<Vec<api::VocabWord>>, HttpError> {
    info!("[API][get_vocab_words] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    let collection =
        db::Collection::get_collection(&state.db_pool, collection_id)?;

    if uid != collection.user_id {
        Err(HttpError::unauthorized())
    } else {
        db::VocabWord::get_vocab_words_for_collection(
            &state.db_pool,
            collection_id,
        )
        .map(|vocab_words| {
            vocab_words
                .into_iter()
                .map(|vocab_word| api::VocabWord {
                    id: vocab_word.id,
                    collection_id: vocab_word.collection_id,
                    word: vocab_word.word,
                    definition: vocab_word.definition.unwrap_or_default(),
                    fails: vocab_word.fails,
                    successes: vocab_word.successes,
                    priority: vocab_word.priority,
                })
                .collect()
        })
        .map(|vocab_words| api::ApiResponse {
            json: Some(Json(vocab_words)),
            status: Status::Ok,
        })
        .map_err(HttpError::from)
    }
}

#[post("/", data = "<vocab_word>")]
pub async fn create_vocab_word(
    vocab_word: Json<api::VocabWord>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<api::VocabWord>, HttpError> {
    info!("[API][create_vocab_word] function triggered!");

    let _uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::VocabWord::insert_vocab_word(&state.db_pool, vocab_word.0)
        .map(|vocab_word| api::ApiResponse {
            json: Some(Json(vocab_word)),
            status: Status::Created,
        })
        .map_err(HttpError::from)
}

#[put("/", data = "<vocab_word>")]
pub async fn update_vocab_word(
    vocab_word: Json<api::VocabWord>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<api::VocabWord>, HttpError> {
    info!("[API][update_vocab_word] function triggered!");

    let _uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::VocabWord::update_vocab_word(&state.db_pool, vocab_word.0)
        .map(|vocab_word| api::ApiResponse {
            json: Some(Json(vocab_word)),
            status: Status::Ok,
        })
        .map_err(HttpError::from)
}

#[put("/<collection_id>", data = "<vocab_words>")]
pub async fn update_vocab_words(
    collection_id: &str,
    vocab_words: Json<Vec<api::VocabWord>>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<Vec<api::VocabWord>>, HttpError> {
    info!("[API][update_vocab_words] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    let collection =
        db::Collection::get_collection(&state.db_pool, collection_id)?;

    if uid != collection.user_id {
        Err(HttpError::unauthorized())
    } else {
        db::VocabWord::update_vocab_words_for_collection(
            &state.db_pool,
            vocab_words.0,
        )
        .map(|vocab_words| api::ApiResponse {
            json: Some(Json(vocab_words)),
            status: Status::Ok,
        })
        .map_err(HttpError::from)
    }
}
