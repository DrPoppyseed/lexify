# Lexify

A digital flip cards app. I built it so I can learn vocabulary words the way I
like to.

https://user-images.githubusercontent.com/44737273/196032766-3e063656-9578-4db4-9d58-16847cfbb726.mov

## Technology

Lexify is built with React/Typescript/vite for the frontend and the Rust/Rocket/Mysql
for the backend.
Firebase is used for authentication.

## Testing

Currently we only have integration tests for our API. To get started, first
create the mysql instance by running docker compose.

```bash
$ cd backed && docker-compose up
```

Then, run the tests using cargo's testing or by using `nextest`. You might need
to install `nextest` to your local environment if you haven't already.

```bash
$ cargo nextest run -- --ignored
```

## Running

The frontend code can be run on localhost with `make frontend_up` and the backend
similarly with `make backend_up`.
