CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY user_idx (user_id)
);

CREATE TABLE IF NOT EXISTS vocab_words (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    collection_id VARCHAR(255) NOT NULL,
    word VARCHAR(255) NOT NULL,
    definition TEXT,
    fails INT NOT NULL DEFAULT 0,
    successes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority INT NOT NULL DEFAULT 0,
    KEY collection_idx (collection_id)
);