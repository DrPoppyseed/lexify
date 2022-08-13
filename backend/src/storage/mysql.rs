use chrono::NaiveDateTime;
use diesel::{
    Connection,
    Insertable,
    MysqlConnection,
    Queryable,
    QueryDsl,
    r2d2,
    r2d2::{ConnectionManager, Pool, PooledConnection},
    result::Error,
    RunQueryDsl,
};
use serde::{Deserialize, Serialize};

use crate::{
    lib,
    storage::{
        mysql::StorageError::DatabaseError,
        schema::{collections, users, vocab_words},
    },
};

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[table_name = "collections"]
pub struct Collection {
    id: i32,
    user_id: i32,
    name: String,
    description: Option<String>,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "users"]
pub struct User {
    id: i32,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "vocab_words"]
pub struct Word {
    id: i32,
    collection_id: i32,
    word: String,
    definition: Option<String>,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
    fails: i32,
    success: i32,
}

#[derive(Debug)]
pub enum StorageError {
    DatabaseError(String),
    NotFoundError(String),
}

impl From<Error> for StorageError {
    fn from(e: Error) -> Self {
        match e {
            Error::NotFound => Self::NotFoundError(e.to_string()),
            _ => DatabaseError(e.to_string()),
        }
    }
}

impl From<r2d2::PoolError> for StorageError {
    fn from(e: r2d2::PoolError) -> Self {
        DatabaseError(e.to_string())
    }
}

pub type ConnPool = Pool<ConnectionManager<MysqlConnection>>;

// pub struct Conn(pub PooledConnection<ConnectionManager<MysqlConnection>>);

// #[rocket::async_trait]
// impl<'r> FromRequest<'r> for Conn {
//     type Error = ();
//
//     async fn from_request(
//         request: &'r Request<'_>,
//     ) -> Outcome<Self, Self::Error> {
//         // let pool = request.guard::<State<ConnPool>>().await.unwrap();
//         // let pool = request.guard().await;
//         // match pool.get() {
//         //     Ok(conn) => Outcome::Success(Conn(conn)),
//         //     Err(_) => Outcome::Failure((Status::ServiceUnavailable, ())),
//         // }
//         match request.guard().await {
//             Outcome::Success(c) => Outcome::Success(Conn(c)),
//         }
//     }
// }
//
// impl Deref for Conn {
//     type Target = MysqlConnection;
//     fn deref(&self) -> &Self::Target {
//         &self.0
//     }
// }

pub fn connect(
    pool: ConnPool,
) -> Result<PooledConnection<ConnectionManager<MysqlConnection>>, StorageError>
{
    pool.get().map_err(StorageError::from)
}

impl Collection {
    pub async fn insert_collection(
        conn: lib::DbConn,
        new_collection: Collection,
    ) -> Result<usize, StorageError> {
        conn.run(move |c| {
            diesel::insert_into(collections::table)
                .values(&new_collection)
                .execute(c)
        })
            .await
            .map_err(StorageError::from)
    }

    pub fn get_collection(
        pool: ConnPool,
        collection_id: i32,
    ) -> Result<Self, StorageError> {
        connect(pool).and_then(|conn| {
            conn.transaction(|| {
                collections::dsl::collections
                    .find(collection_id)
                    .get_result::<Collection>(&conn)
                    .map_err(StorageError::from)
            })
        })
    }
}
