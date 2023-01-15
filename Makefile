
build:
	docker-compose build

start:
	docker-compose --env-file .env up -d

stop:
	docker-compose down

restart:
	docker-compose restart

rebuild-front: 
	docker-compose build  frontend
	docker-compose up -d --force-recreate frontend


rebuild-rank: 
	docker-compose build  rank
	docker-compose up -d --force-recreate rank


rebuild-nginx:
	docker-compose build  nginx
	docker-compose up -d --force-recreate nginx




