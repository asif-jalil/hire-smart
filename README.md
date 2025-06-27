## Project Setup Guide

This project uses **NestJS**, **PostgreSQL**, and **TypeORM**. Follow the steps below to get your local development environment running.

### Prerequisites

- Node.js v18+
- PostgreSQL running locally
- `npm` or `yarn`

---

### Step 1 — Initial Setup

Install dependencies and prepare the environment:

```bash
npm run setup
```

This will:

- Install all required Node.js packages
- Create a .env file from .env.example (if it doesn't already exist)

### Step 2 — Configure Environment Variables

Open the newly created .env file and update it with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
```

> Make sure your PostgreSQL server is running and accessible with the above credentials.

### Step 3 — Set Up the Database

After configuring the .env file, run:

```
npm run setup:db
```

This will:

- Run all pending database migrations (npm run migration:run)
- Execute seed scripts (npm run seed:run)

## Step 4 — Start the Development Server

Start the app in development mode:

```
npm run start:dev
```

Once running, the server will be available at:

```
http://localhost:4000
```

Default admin credential is

```
email: admin@mail.com
password: defaultPass123!
```

### NPM Scripts Overview

| Script                                           | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| `npm run start`                                  | Starts the app in normal mode.               |
| `npm run start:dev`                              | Starts the app in dev mode with live reload. |
| `npm run start:prod`                             | Runs the compiled app in production.         |
| `npm run lint`                                   | Lints and auto-fixes TypeScript files.       |
| `npm run format`                                 | Formats code using Prettier.                 |
| `npm run migration:generate --name=my-db-create` | Generates a new migration file.              |
| `npm run migration:run`                          | Applies pending migrations.                  |
| `npm run migration:revert`                       | Reverts the last migration.                  |
| `npm run schema:drop`                            | Drops the current DB schema.                 |
| `npm run seed:generate --name=my-db-seed`        | Generates a new seed file.                   |
| `npm run seed:run`                               | Executes seed scripts.                       |
