use lexify_api::rocket_launch::{establish_connection_pool, rocket_launch};

#[rocket::main]
async fn main() {
    let db_pool = establish_connection_pool(".env");
    let _server = rocket_launch(db_pool).await;
}
