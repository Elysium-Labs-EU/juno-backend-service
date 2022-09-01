# Juno backend - [![Codacy Badge](https://app.codacy.com/project/badge/Grade/bd0d77d77497483dae29b0360594c0fe)](https://www.codacy.com/gh/Elysium-Labs-EU/juno-backend-service/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Elysium-Labs-EU/juno-backend-service&utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/ca475727f33352dffbfb/maintainability)](https://codeclimate.com/github/Elysium-Labs-EU/juno-backend-service/maintainability) [![CircleCI](https://circleci.com/gh/Elysium-Labs-EU/juno-backend-service/tree/main.svg?style=svg)](https://circleci.com/gh/Elysium-Labs-EU/juno-backend-service/tree/main) [![discord](https://img.shields.io/badge/Discord-Community-blueviolet)](https://discord.gg/peRDGMn9xa) 

The backend code for the application Juno, build in NodeJS. This serves as an API layer connecting the React frontend to the Gmail API services.

## Getting started

You need to have a Google API account. With that account you setup your account to eventually set the `.env`-variables. Follow these steps: https://developers.google.com/workspace/guides/create-credentials and https://github.com/Elysium-Labs-EU/juno-core/wiki/Google-Credentials-setup

The normal setup sequence would be;

1.  Download the code to your local machine
2.  Setup your Google Credentials. Read here how to setup Google Credentials: https://developers.google.com/workspace/guides/create-credentials. The credential version is `Web application`.
3.  For the Google Web Application credentials you created on step 2, as the `Authorised JavaScript origins` set `http://localhost:3000`. This is done via the Google Cloud Console, by clicking on the credentials' name under Credentials > OAuth 2.0 Client IDs , and enter the form.
4.  Also for the Google Web Application credentials you created on step 2, as the `Authorised redirect URIs` set `http://localhost:3000/oauth2callback`. This is done via the Google Cloud Console, by clicking on the credentials' name under Credentials > OAuth 2.0 Client IDs , and enter the form.
5.  At the Google Web Application credentials you created on step 2, go to the `Test users` set yourself as a test user. This is done via the Google Cloud Console, by clicking on the credentials' name under OAuth consent screen > OAuth user cap , and enter the form.
6.  At the Google Web Application credentials you created on step 2, go to the `APIs & Services` and enable the required api and services. This is done via the Google Cloud Console, by clicking on the credentials' name under Enabled APIs and Services > + Enable APIs and Services button on the top , and enable the Gmail API and People API. Now the Google credentials are set up there.
7.  Back in your terminal run `make env-setup` Mac/Linux to install all dependencies
8.  Create a file called `.env` in the root of the project and follow steps - see `.env.example` in the root of the project for examples.
9.  Add `GOOGLE_CLIENT_ID` - the value is the client id from your Google Credentials.
10. Add `GOOGLE_CLIENT_SECRET` with the related Google Client Secret
11. Add `GOOGLE_REDIRECT_URL` with the related Google Redirect URL - should be `/oauth2callback`
12. Add `FRONTEND_URL` with the related Google Redirect URL - should be `http://localhost:3000`
13. Add `NODE_ENV`='development
14. Add `SESSION_SECRET`=Anything to your liking
15. The other variable names found in `.env.example` can be ignore for development, as long as `NODE_ENV` is set to `development'.
16. Run `make run-server` or `make run-clean-server` for Mac/Linux from the root to start the server (using nodemon)
17. Once the server is running, you can open `/swagger` to see the SwaggerUI for all API's.

You are now good to go and run the frontend. See its [Getting Started](https://github.com/Elysium-Labs-EU/juno-core/blob/main/README.md).

## Contributing

Thank you for using Juno 😎 . With the help of its contributors, your experience with email will be as good as possible 🚀.

Looking for a first issue to tackle?

- Issues tagged with `good first issue` are a good place to start.
- Or contact me via [Discord](https://discord.gg/peRDGMn9xa)

Contributing guidelines

- When encountering a bug, create a Github issue with the bug label in the active project. Be as specific as possible.
- To suggest a new feature, create a Github issue with the enhancement label in the active project.

Your system should run on the development `dev` branch to be in sync with the latest development changes.
