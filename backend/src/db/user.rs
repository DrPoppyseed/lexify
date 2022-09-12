use std::ops::Deref;

use diesel::{Connection, OptionalExtension, QueryDsl, RunQueryDsl};

use crate::{
    db::{schema::users, StorageError, User},
    rocket_launch::DbPool,
};

impl User {
    pub async fn insert_user(
        pool: &DbPool,
        new_user: User,
    ) -> Result<(), StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            diesel::insert_into(users::table)
                .values(&new_user)
                .execute(pool.deref())
                .map(|_| ())
        })
        .map_err(StorageError::from)
    }

    pub async fn get_user(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Option<User>, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            users::dsl::users
                .find(user_id)
                .first(pool.deref())
                .optional()
        })
        .map_err(StorageError::from)
    }

    pub async fn get_user_pooled(
        pool: &DbPool,
        user_id: String,
    ) -> Result<Option<User>, StorageError> {
        let pool = pool.get()?;

        pool.transaction(|| {
            users::dsl::users
                .find(user_id)
                .first(pool.deref())
                .optional()
        })
        .map_err(StorageError::from)
    }
}
