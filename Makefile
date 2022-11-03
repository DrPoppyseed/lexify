web:
	cd web && pnpm vite

api:
	cd lexify-rocket-api && cargo watch -x run

test-api:
	cargo test --no-fail-fast -- --test-threads=1

force_clean_all_containers:
	docker ps -aq | xargs docker stop | xargs	docker rm
