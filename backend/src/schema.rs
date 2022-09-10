// @generated automatically by Diesel CLI.

diesel::table! {
    collections (id) {
        id -> Varchar,
        user_id -> Nullable<Varchar>,
        name -> Varchar,
        description -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    vocab_words (id) {
        id -> Varchar,
        collection_id -> Nullable<Varchar>,
        word -> Varchar,
        definition -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        fails -> Nullable<Integer>,
        successes -> Nullable<Integer>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    collections,
    users,
    vocab_words,
);
