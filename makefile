# redis:
# 	docker run --name sports_complex -d -p 6379:6379 redis redis-server --requirepass pass --maxmemory 512mb

# postgres:
# 	docker run --name sports_complex -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=pass -d postgres:15-alpine

# createdb:
# 	docker exec -it sports_complex createdb --username=root --owner=root sports_complex
	
# dropdb:
# 	docker exec -it sports_complex dropdb sports_complex

# migrate: 
# 	npx knex --migrations-directory=./src/database/migrations migrate:make $(MIGRATION) -x ts 

# migrateup:
# 	npx knex migrate:up

# migratedown:
# 	npx knex migrate:down

# migratelatest:
# 	npx knex migrate:latest

server:
	npm run server

.PHONY: server