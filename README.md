# Juno backend - [![Codacy Badge](https://app.codacy.com/project/badge/Grade/bd0d77d77497483dae29b0360594c0fe)](https://www.codacy.com/gh/Elysium-Labs-EU/juno-backend-service/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Elysium-Labs-EU/juno-backend-service&utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/ca475727f33352dffbfb/maintainability)](https://codeclimate.com/github/Elysium-Labs-EU/juno-backend-service/maintainability)

The backend code for the application Juno, build in NodeJS. This serves as an API layer connecting the React frontend to the Gmail API services.

## Getting started

You need to have a Google API account. With that account you setup your account to eventually set the `.env`-variables. Follow these steps: https://developers.google.com/workspace/guides/create-credentials and https://github.com/Elysium-Labs-EU/juno-core/wiki/Google-Credentials-setup

The normal setup sequence would be;

1.  Download the code to your local machine
2.  Run `yarn` to install all dependencies
3.  Store the `credentials.json` inside the folder `/google`
4.  Create a file called .env in the root of the project
5.  Add `GOOGLE_CLIENT_ID` with the related Google Client ID
6.  Add `GOOGLE_CLIENT_SECRET` with the related Google Client Secret
7.  Add `GOOGLE_REDIRECT_URL` with the related Google Redirect URL - can be `http://localhost`
8.  Run `yarn start:watch` from the root to start the server (using nodemon)
9.  Once the server is running, you can open `/` to see the SwaggerUI for all API's.

You are now good to go and run the frontend. See its [Getting Started](https://github.com/Elysium-Labs-EU/juno-core/blob/main/README.md).

## Contributing

Thank you for using Juno 😎 . With the help of its contributors, your experience with email will be as good as possible 🚀.

Looking for a first issue to tackle?

- Issues tagged with `good first issue` are a good place to start.
- Or contact me via Discord: `Dhr_RT#5882`

Contributing guidelines

- When encountering a bug, create a Github issue with the bug label in the active project. Be as specific as possible.
- To suggest a new feature, create a Github issue with the enhancement label in the active project.
