use backend::establish_connection_pool;
use rocket::{self, get, routes, serde::json::Json, State};

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
