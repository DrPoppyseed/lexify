use axum::Router;

use crate::AppState;

mod users;

pub fn create_routes() -> Router<AppState> {
    Router::new().nest("/users", users::create_routes())
}
