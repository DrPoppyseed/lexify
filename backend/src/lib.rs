use rocket_sync_db_pools::database;

#[database("mysql_db")]
pub struct DbConn(diesel::MysqlConnection);

// pub fn establish_connection() -> MysqlConnection {
//     dotenv().ok();
//
//     let database_url = env::var("DATABASE_URL").expect(
//         "Error: failed to get env variable `DATABASE_URL`. Is the variable set in the .env file?",
//     );
//     MysqlConnection::establish(&database_url)
//         .expect(&format!("Error connecting to {}", database_url))
// }
