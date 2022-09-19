use std::{env, str::FromStr};

use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use diesel_tracing::mysql::InstrumentedMysqlConnection;
use dotenv;
use rocket::{Build, Rocket};
use rocket_cors::{AllowedOrigins, CorsOptions};

use crate::{
    api::{collection, user},
    auth::{FirebaseConfig, JwtConfig},
};

pub type DbPool = Pool<ConnectionManager<InstrumentedMysqlConnection>>;
pub type DbPooled =
    PooledConnection<ConnectionManager<InstrumentedMysqlConnection>>;

pub struct ServerState {
    pub db_pool:        DbPool,
    pub firebase_admin: FirebaseConfig,
    pub jwt_config:     JwtConfig,
}

pub fn establish_connection_pool(env_filename: &str) -> DbPool {
    dotenv::from_filename(env_filename).ok();

    let database_url = env::var("DB_URL")
        .expect("Failed to retrieve environment value DB_URL.");

    Pool::builder()
        .build(ConnectionManager::<InstrumentedMysqlConnection>::new(
            database_url,
        ))
        .expect("Failed to establish database connection pool.")
}

pub async fn rocket_launch(server_state: ServerState) -> Rocket<Build> {
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
        .mount("/users", user::routes())
        .mount("/collections", collection::routes())
        .mount("/", rocket_cors::catch_all_options_routes())
        .attach(cors.clone())
        .manage(cors)
        .manage(server_state)
}
