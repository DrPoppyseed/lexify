use std::error::Error;

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::MysqlConnection;
use rocket::serde::json::Json;
use rocket::{post, routes, Route};
use serde::Deserialize;
use serde_json::Value;

pub fn routes() -> Vec<Route> {
    routes! {
      create_collection
    }
}

#[derive(Deserialize)]
struct Collection {
    id: String,
    name: String,
    description: String,
}

#[post("/collections", data = "<collection>")]
pub fn create_collection(
    collection: Json<Collection>,
    pool: Pool<ConnectionManager<MysqlConnection>>,
) -> Result<Value, Box<dyn Error>> {
    let pool = pool.get();
}
