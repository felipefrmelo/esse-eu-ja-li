
build:
	docker-compose build

start:
	docker-compose --env-file .env up -d

stop:
	docker-compose down


