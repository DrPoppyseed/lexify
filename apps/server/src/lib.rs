#![feature(result_option_inspect)]

use std::{net::SocketAddr, sync::Arc};

use axum::{
    http,
    response::{IntoResponse, Response},
    Json,
    Router,
    Server,
};
use db::PrismaClient;
use errors::ApiError;
use rocket_firebase_auth::FirebaseAuth;
use serde::Serialize;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod api;
mod db;
mod errors;
mod extractor;
mod protocol;

pub type ApiResult<T> = Result<T, ApiError>;
pub type JsonApiResult<T> = ApiResult<JsonResponse<T>>;

#[derive(Debug)]
pub struct JsonResponse<T>
where
    T: Serialize,
{
    status: http::StatusCode,
    body:   T,
}

impl<T> IntoResponse for JsonResponse<T>
where
    T: Serialize,
{
    fn into_response(self) -> Response {
        (self.status, Json(self.body)).into_response()
    }
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub prisma: Arc<PrismaClient>,
    pub auth:   Arc<FirebaseAuth>,
}

pub async fn server() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "lexify_server=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let auth = FirebaseAuth::builder()
        .env("FIREBASE_ADMIN_CERTS")
        .build()
        .expect("failed to build FirebaseAuth client");

    let prisma = PrismaClient::_builder()
        .build()
        .await
        .expect("failed to build Prisma client");

    let state = AppState {
        auth:   Arc::new(auth),
        prisma: Arc::new(prisma),
    };

    let service = Router::new()
        .nest("/api", api::create_routes())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any))
        .with_state(state)
        .into_make_service();

    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));

    Server::bind(&addr)
        .serve(service)
        .await
        .expect("failed to start server")
}
