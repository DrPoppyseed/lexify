use diesel::table;

table! {
  users (id) {
    id -> Integer,
    created_at -> Timestamp,
    updated_at -> Timestamp,
  }
}

table! {
  collections (id) {
    id -> Integer,
    user_id -> Integer,
    name -> VarChar,
    description -> Nullable<Text>,
    created_at -> Timestamp,
    updated_at -> Timestamp,
  }
}

table! {
  vocab_words (id) {
    id -> Integer,
    collection_id -> Integer,
    word -> VarChar,
    definition -> Nullable<Text>,
    created_at -> Timestamp,
    updated_at -> Timestamp,
    fails -> Integer,
    success -> Integer,
  }
}
