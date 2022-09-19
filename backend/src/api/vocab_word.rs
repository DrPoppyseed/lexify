use futures::TryFutureExt;
use rocket::{
    http::Status,
    post,
    put,
    routes,
    serde::json::Json,
    Route,
    State,
};
use tracing::{error, info};

use crate::{
    api,
    auth::BearerToken,
    db,
    http_error::HttpError,
    rocket_launch::ServerState,
};

pub fn routes() -> Vec<Route> {
    routes![create_vocab_word, update_vocab_word]
}

#[post("/", data = "<vocab_word>")]
pub async fn create_vocab_word(
    vocab_word: Json<api::VocabWord>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][create_vocab_word] function triggered!");

    let _uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::VocabWord::insert_vocab_word(&state.db_pool, vocab_word.0)
        .map_ok(|_| Status::Created)
        .map_err(|e| {
            error!("[API][create_vocab_word] {:#?}", e);
            HttpError::from(e)
        })
        .await
}

#[put("/", data = "<vocab_word>")]
pub async fn update_vocab_word(
    vocab_word: Json<api::VocabWord>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][update_vocab_word] function triggered!");

    let _uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::VocabWord::update_vocab_word(&state.db_pool, vocab_word.0)
        .map_ok(|_| Status::Ok)
        .map_err(|e| {
            error!("[API][update_vocab_word] {:#?}", e);
            HttpError::from(e)
        })
        .await
}
