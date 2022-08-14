#[macro_use]
extern crate diesel;

use rocket::{get, routes};

use crate::api::collection;

mod api;
mod auth;
mod http_error;
mod lib;
mod storage;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[rocket::main]
async fn main() {
    rocket::build()
        .mount("/", routes![index])
        .mount("/collections", collection::routes())
        .attach(lib::DbConn::fairing())
        .launch()
        .await
        .ok();
}
