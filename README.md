# 🎉 URL Shortner API

Project based on **Node.js**, **Express.js** and **Typescript**. Provides API for shortening URL's.

## 💻 Pre Requisites

- **Node.js** version **21** or greater.

## 🛒 Dependencies used by the project

- **zod**
- **express**
- **env-cmd**
- **jsonwebtoken**
- **cookie-parser**
- **@prisma/client**

## Available scripts

- `npm run dev` for running the application in local environment.
- `npm run start` for running the application in production environment.
- `npm run build` for building the application for production environment.

## ✈️ Required environment variables

- See `.env.example` file for environment variables.

## 🗒️ How to run

- Run `npm i`.
- Run `npx prisma migrate dev` to synchronize **prisma schema** with the database.
- Provide a name for the database migration for example: **init**.
- Run `npm run dev` for local development.
- Run `npm run build` to build the project for production.

## Author

- Github - [Arsalan Ansari](https://github.com/arsalanansariofficial/).
