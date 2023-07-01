SHELL := /bin/bash
env-setup:
	brew install redis
	brew services start redis
	yarn

run-server:
	yarn
	yarn start:watch

run-clean-server:
	redis-cli flushall
	brew services restart redis
	yarn
	yarn start:watch
