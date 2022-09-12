use std::{env, str::FromStr};

use diesel::{
    r2d2::{ConnectionManager, Pool, PooledConnection},
    MysqlConnection,
};
use dotenv;
use rocket::{Build, Rocket};
use rocket_cors::{AllowedOrigins, Cors, CorsOptions};

use crate::api::{collection, user};

pub type DbPool = Pool<ConnectionManager<MysqlConnection>>;
pub type DbPooled = PooledConnection<ConnectionManager<MysqlConnection>>;

pub struct ServerState {
    pub db_pool: DbPool,
}

pub fn establish_connection_pool(env_file_name: &str) -> DbPool {
    dotenv::from_filename(env_file_name).ok();

    let database_url = env::var("DB_URL")
        .expect("Failed to retrieve environment value DB_URL.");

    Pool::builder()
        .build(ConnectionManager::<MysqlConnection>::new(database_url))
        .expect("Failed to establish database connection pool.")
}

pub async fn rocket_launch(db_pool: DbPool) -> Rocket<Build> {
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
        .expect("Failed to setup cors configuration.");

    rocket::build()
        .mount("/user/", user::routes())
        .mount("/collection/", collection::routes())
        .mount("/", rocket_cors::catch_all_options_routes())
        .attach(cors.clone())
        .manage(cors)
        .manage(ServerState { db_pool })
}
