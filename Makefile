frontend_up:
	cd frontend && pnpm dev

backend_up:
	cd backend && cargo watch -x run

force_clean_all_containers:
	docker ps -aq | xargs docker stop | xargs	docker rm
