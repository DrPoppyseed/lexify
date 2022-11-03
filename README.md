# Lexify

🛠 __Under active development__

A digital flip cards app. I built it so I can learn vocabulary words the way I
like to.

https://user-images.githubusercontent.com/44737273/197379378-38541907-32d8-4d47-ac91-ec57ce111084.mov

## Technology

Lexify is built with React/Typescript/vite for the frontend and the Rust/Rocket/Mysql
for the backend.
Firebase is used for authentication.

### Frontend

State management is handled with react-query(async data like vocab words and collections) and react Context(auth, app state).

### Backend

Rocket(Rust) and mysql is used for a fast server.

## Testing

Currently, we only have integration tests for our API. To get started, first
create the mysql instance by running docker compose.

```bash
$ cd lexify-rocket-api && docker-compose up -d
```

Then, run the tests using cargo's testing or by using `nextest`. You might need
to install `nextest` to your local environment if you haven't already.

```bash
$ cargo test --no-fail-fast -- --test-threads=1
```

## Running

The frontend code can be run on localhost with `make web` and the backend
similarly with `make api`.
