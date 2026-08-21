.PHONY: up down logs prod prod-down build test

## Local development (hot reload)
up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

## Production-like stack on :8080
prod:
	docker compose -f docker-compose.prod.yml up --build -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

## Rebuild images only
build:
	docker compose build
	docker compose -f docker-compose.prod.yml build

## Run server tests in a one-off container
test:
	docker compose run --rm -e NODE_ENV=test server npm test
