#[macro_use]
extern crate diesel;

use rocket::{self, get, routes};

use backend::establish_connection_pool;

mod api;
mod storage;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[rocket::main]
async fn main() {
    let connection_pool = establish_connection_pool();

    rocket::build()
        .mount("/", routes![index])
        .manage(connection_pool)
        .launch()
        .await
        .ok();
}
