SHELL := /bin/bash
run-server:
	export GOOGLE_APPLICATION_CREDENTIALS="/Users/r.tuerlings/Coding/juno-backend-service/juno-d50a9-firebase-adminsdk-kp20s-8c1ea515e7.json"
	yarn start:watch

run-clean-server:
	brew services restart redis
	yarn
	yarn start:watch