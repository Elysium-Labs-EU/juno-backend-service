SHELL := /bin/bash
env-setup:
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	brew install redis
	yarn

run-server:
	yarn
	yarn start:watch

run-clean-server:
	redis-cli flushall
	brew services restart redis
	yarn
	yarn start:watch