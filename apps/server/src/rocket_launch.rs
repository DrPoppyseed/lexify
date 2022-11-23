use std::{env, str::FromStr};

use diesel::{
    r2d2::{ConnectionManager, Pool, PooledConnection},
    MysqlConnection,
};
use dotenvy;
use rocket::{Build, Rocket};
use rocket_cors::{AllowedOrigins, CorsOptions};
use rocket_firebase_auth::auth::FirebaseAuth;

use crate::api::{collection, user, vocab_word};

pub type DbPool = Pool<ConnectionManager<MysqlConnection>>;
pub type DbPooled = PooledConnection<ConnectionManager<MysqlConnection>>;

pub struct ServerState {
    pub db_pool: DbPool,
    pub auth: FirebaseAuth,
}

pub fn establish_connection_pool(env_filename: &str) -> DbPool {
    dotenvy::from_filename(env_filename).ok();

    let database_url = env::var("DB_URL")
        .expect("Failed to retrieve environment value DB_URL.");

    Pool::builder()
        .build(ConnectionManager::<MysqlConnection>::new(database_url))
        .expect("Failed to establish database connection pool.")
}

pub async fn rocket_launch(server_state: ServerState) -> Rocket<Build> {
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            ["Get", "Post", "Put", "Delete", "Options"]
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
        .mount("/vocab_words", vocab_word::routes())
        .mount("/", rocket_cors::catch_all_options_routes())
        .attach(cors.clone())
        .manage(cors)
        .manage(server_state)
}
