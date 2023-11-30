mongo:
	docker run --name url_shortner -p 27017:27017 -d mongo

stopdb:
	docker stop url_shortner

startdb:
	docker start url_shortner

server:
	npm run dev

.PHONY: mongo startdb stopdb server