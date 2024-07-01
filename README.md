# Mini-ETL like Fiber.DEV (YC)

## Introduction

This is a mini-ETL project like Fiber (YC) but smaller version. It's allows users to extract data from a source, transform it, and load it into a destination. The project is built using next.js (Frontend) and NestJS (Backend).

- CURRENTLY IT SUPPORT ONLY GITHUB

This is just a demonstration project and it can be extended to support other data sources like Gitlab, Bitbucket, etc.

## Features

- Extract data from Github (Public Repositories, ISSUES, Pull Requests)
- Transform the data
- Load the data into a destination (Support PostgreSQL and S3)
- Auto Sync

# Backend (NestJS)

- [ApiGateway](api_gateway)
- [SyncService (Microservice)](sync_service)

## Stack

- NestJS (Node.js Framework)
- PostgreSQL (Database)
- PG, Prisma and Drizzle (ORM)
- Docker (Containerization)
- RabbitMQ (Message Broker)
- DigitalOcean (Deployment)

# How to Run the Project?

To run this project, you need to have node installed on your machine. You can download it from [here](https://nodejs.org/en/). This project have Two parts:

1. Frontend (Next.js) - `cd frontend`
2. Backend (NestJS)

   - ApiGateway - `cd api_gateway`
   - SyncService - `cd sync_service`

### Backend (NestJS - SyncService)

First we need to run the sync service. To run the sync service, you need to have RabbitMQ and postgres connection Strings. You can create a `.env` file in the `sync_service` directory as like the .env.example file.

```bash
RABBITMQ_QUEUE=""
RABBITMQ_URL=""
DATABASE_URL=""
DATABASE_URL_DRIZZLE="" // no need this
```

After creating the `.env` file, you can run the following commands:

```bash
# generate the prisma client
pnpm install
npx prisma generate && npx prisma db push
pnpm start:dev
```

### Backend (NestJS - ApiGateway)

First we need to run the api gateway. To run the api gateway, you need to have RabbitMQ and postgres connection Strings. You can create a `.env` file in the `api_gateway` directory as like the .env.example file.

```bash
DATABASE_URL=
GITHUB_CALLBACK_URL=http://localhost:3000/auth/callback/github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
JWT_SECRET=
RABBITMQ_QUEUE=
RABBITMQ_URL=
AUTH_FRONTEND_REDIRECT_URL=""
FRONTEND_URL=""
```

After creating the `.env` file, you can run the following commands:

```bash
pnpm install
npx prisma generate && npx prisma db push
pnpm start:dev
```

### Frontend (Next.js)

To run the frontend, you need to have the following environment variables. You can create a `.env.local` file in the `frontend` directory as like the .env.example file.

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

After creating the `.env.local` file, you can run the following commands:

```bash
pnpm install
pnpm dev
```
