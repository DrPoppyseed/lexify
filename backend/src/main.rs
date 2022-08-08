#[macro_use]
extern crate diesel;

use crate::api::collection;
use rocket::{get, routes};

mod api;
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
