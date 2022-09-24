use futures::TryFutureExt;
use rocket::{
    get,
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
    routes![
        get_collection,
        get_collections,
        create_collection,
        update_collection
    ]
}

#[get("/")]
pub async fn get_collections(
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<Vec<api::Collection>>, HttpError> {
    info!("[API][get_collections] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    db::Collection::get_collections(&state.db_pool, uid)
        .map_ok(|db_collections| {
            info!("[API][get_collections] collections fetched from database!");
            db_collections
                .into_iter()
                .map(|collection| api::Collection {
                    id:          collection.id,
                    user_id:     collection.user_id,
                    name:        collection.name,
                    description: collection.description,
                })
                .collect()
        })
        .map_ok(|api_collections| api::ApiResponse {
            json:   Some(Json(api_collections)),
            status: Status::Ok,
        })
        .map_err(|e| {
            error!("[API][get_collections] {:#?}", e);
            HttpError::from(e)
        })
        .await
}

#[post("/", data = "<collection>")]
pub async fn create_collection(
    collection: Json<api::Collection>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][create_collection] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    if uid != collection.user_id.clone() {
        Err(HttpError::forbidden())
    } else {
        info!("[API][create_collection] user={uid} inserting collection.");
        db::Collection::insert_collection(&state.db_pool, collection.0)
            .map_ok(|_| Status::Created)
            .map_err(|e| {
                error!("[API][create_collection] {:#?}", e);
                HttpError::from(e)
            })
            .await
    }
}

#[put("/", data = "<collection>")]
pub async fn update_collection(
    collection: Json<api::Collection>,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<Status, HttpError> {
    info!("[API][update_collection] function triggered!");

    let uid = api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .await?;

    if uid != collection.user_id.clone() {
        Err(HttpError::forbidden())
    } else {
        db::Collection::update_collection(&state.db_pool, collection.0)
            .map_ok(|_| Status::Ok)
            .map_err(|e| {
                error!("[API][update_collection] {:#?}", e);
                HttpError::from(e)
            })
            .await
    }
}

#[get("/<collection_id>")]
pub async fn get_collection(
    collection_id: &str,
    state: &State<ServerState>,
    token: BearerToken,
) -> Result<api::ApiResponse<api::CollectionWithVocabWords>, HttpError> {
    info!("[API][get_collection] function triggered!");

    api::get_uid_from_token(state, &token)
        .map_err(|_| HttpError::unauthorized())
        .and_then(|uid| async move {
            db::Collection::get_collection(&state.db_pool, collection_id)
                .map_err(HttpError::from)
                .await
                .and_then(|collection| {
                    if uid == collection.user_id {
                        Ok(collection)
                    } else {
                        Err(HttpError::forbidden())
                    }
                })
        })
        .and_then(|collection| {
            db::VocabWord::get_vocab_words_for_collection(
                &state.db_pool,
                collection_id,
            )
            .map_err(HttpError::from)
            .map_ok(|vocab_words| (collection, vocab_words))
        })
        .map_ok(|(collection, vocab_words)| {
            let api_vocab_words = vocab_words
                .into_iter()
                .map(|vocab_word| api::VocabWord {
                    id:            vocab_word.id,
                    collection_id: vocab_word.collection_id,
                    word:          vocab_word.word,
                    definition:    vocab_word.definition.unwrap_or_default(),
                    fails:         vocab_word.fails,
                    successes:     vocab_word.successes,
                })
                .collect();

            (collection, api_vocab_words)
        })
        .map_ok(|(collection, vocab_words)| api::CollectionWithVocabWords {
            collection_id: collection.id,
            user_id:       collection.user_id,
            name:          collection.name,
            description:   collection.description,
            words:         vocab_words,
        })
        .map_ok(|response_body| api::ApiResponse {
            json:   Some(Json(response_body)),
            status: Status::Ok,
        })
        .await
}
