install:
	npm ci

setup: install
	npm run build

lint:
	npm run lint

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

.PHONY: install setup lint dev build preview
