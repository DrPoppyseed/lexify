web:
	cd packages/web && pnpm vite

api:
	cd packages/rocket-api && cargo watch -x run

force_clean_all_containers:
	docker ps -aq | xargs docker stop | xargs	docker rm
