mongo:
	docker run --name url_shortner -p 27017:27017 -d mongo

stopdb:
	docker stop url_shortner

startdb:
	docker start url_shortner

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
	npm run dev

.PHONY: mongo startdb stopdb server