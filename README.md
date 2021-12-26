# Juno backend - [![Codacy Badge](https://app.codacy.com/project/badge/Grade/60e1bcc29c7849a2b198ed33828118a5)](https://www.codacy.com/gh/Elysium-Labs-EU/juno-backend/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Elysium-Labs-EU/juno-backend&utm_campaign=Badge_Grade)

The backend code for the application Juno, build in NodeJS. This serves as an API layer connecting the React frontend to the Gmail API services.

## Getting started

You need to have a Google API account. With that account you setup your account to eventually download `credentials.json`. Follow these steps: https://developers.google.com/workspace/guides/create-credentials and https://github.com/Elysium-Labs-EU/juno-core/wiki/Google-Credentials-setup

The normal setup sequence would be;

1.  Download the code to your local machine
2.  Run `yarn` to install all dependencies
3.  Store the `credentials.json` inside the folder `/google`
4.  Run `yarn start` from the root to start the server (using nodemon)
5.  If case you have no `token.json` in the folder `/google` the code will generate one for you, follow the steps in the console.
6.  Once the server is running, you can open `/api-docs` to see the SwaggerUI for all API's.

You are now good to go and run the frontend. See its [Getting Started](https://github.com/Elysium-Labs-EU/juno-core/blob/main/README.md).

## Contributing

Thank you for using Juno 😎 . With the help of its contributors, your experience with email will be as good as possible 🚀.

Looking for a first issue to tackle?

- Issues tagged with `good first issue` are a good place to start.
- Or contact me via Discord: `Dhr_RT#5882`

Contributing guidelines

- When encountering a bug, create a Github issue with the bug label in the active project. Be as specific as possible.
- To suggest a new feature, create a Github issue with the enhancement label in the active project.
