#[macro_use]
extern crate diesel;

use std::str::FromStr;

use rocket::{get, routes};
use rocket_cors::{AllowedOrigins, CorsOptions};

use crate::api::collection;

mod api;
mod auth;
mod http_error;
mod lib;
mod storage;

#[rocket::main]
async fn main() {
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            ["Get", "Post", "Patch", "Delete", "Options"]
                .iter()
                .map(|s| FromStr::from_str(s).unwrap())
                .collect(),
        )
        .allow_credentials(true)
        .to_cors()
        .expect("");

    rocket::build()
        .mount("/collection/", collection::routes())
        .mount("/", rocket_cors::catch_all_options_routes())
        .attach(lib::DbConn::fairing())
        .attach(cors.clone())
        .manage(cors)
        .launch()
        .await
        .ok();
}
