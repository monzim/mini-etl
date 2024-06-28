# Mini-ETL like Fiber.DEV (YC)

## Introduction

This is a mini-ETL project like Fiber (YC) smaller version. It is a simple project that allows users to extract data from a source, transform it, and load it into a destination. The service is built using next.js (Frontend) and NestJS (Backend).

- CURRENTLY IT SUPPORT ONLY GITHUB DATA SOURCE

This is just a demonstration project and it can be extended to support other data sources like Gitlab, Bitbucket, etc.

## Features

- Extract data from Github (Public Repositories, ISSUES, Pull Requests)
- Transform the data
- Load the data into a destination (Support PostgreSQL and S3)
- Auto Sync

# Backend (NestJS)

-- ApiGateway
-- SyncService (Microservice)

## Stack

- NestJS (Node.js Framework)
- PostgreSQL (Database)
- PG, Prisma and Drizzle (ORM)
- Docker (Containerization)
- RabbitMQ (Message Broker)
- DigitalOcean (Deployment)
