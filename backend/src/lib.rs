use diesel::{
    mysql::MysqlConnection,
    r2d2::{ConnectionManager, Pool},
};
use dotenv::dotenv;
use std::env;

pub fn establish_connection_pool() -> Pool<ConnectionManager<MysqlConnection>> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect(
        "Error: failed to get env variable `DATABASE_URL`. Is the variable set in the .env file?",
    );
    let manager = ConnectionManager::<MysqlConnection>::new(&database_url);
    let pool = Pool::builder().build(manager);

    pool.expect("Error: failed to establish connection with remote database.")
}
