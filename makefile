mongo:
	docker run --name url_shortner -p 27017:27017 -d mongo

stopdb:
	docker stop url_shortner

startdb:
	docker start url_shortner

dev:
	npm run dev

test:
	npm run test

prod:
	docker-compose up --build

.PHONY: mongo startdb stopdb dev test prod