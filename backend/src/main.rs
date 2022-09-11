use rocket::{Build, Rocket};

use lexify_api::rocket_launch::{establish_connection_pool, rocket_launch};

#[rocket::launch]
async fn rocket() -> Rocket<Build> {
    let db_pool = establish_connection_pool(".env");

    rocket_launch(db_pool).await
}
