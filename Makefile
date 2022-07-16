SHELL := /bin/bash
run-server:
	yarn
	yarn start:watch

run-clean-server:
	brew services restart redis
	yarn
	yarn start:watch