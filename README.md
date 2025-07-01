# HireSmart

---

## 🚀 Project Setup Guide

This project is fully containerized using Docker. Follow the steps below to get your local development environment up and running.

### Prerequisites

- [Docker](https://www.docker.com/get-started)

---

### Step 1 — Configure Environment Variables

First, create your local environment configuration file by copying the example file:

```bash
cp .env.example .env
```

Next, open the newly created `.env` file and fill in the required credentials for the database and Redis. **This step is mandatory**, as Docker Compose will use these variables to initialize the services.

```ini
# .env

# API Port
API_PORT=4000

# PostgreSQL Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Redis Configuration
REDIS_PASSWORD=your_redis_password

# Secrets
CSRF_SECRET=supersecretcsrfsecret
SESSION_SECRET=my-session-secret
COOKIE_SECRET=my-cookie-secret

JWT_SECRET=randomstring
ENCRYPTION_SECRET=somethingwentwrong

# Feature flags
IS_CSRF_ENABLED=false
```

### Step 2 — Build and Run the Docker Containers

With the environment variables configured, build and start the services in detached mode:

```bash
docker-compose up --build -d
```

This command will build the application image and start the `hire-smart-app`, PostgreSQL, and Redis containers.

### Step 3 — Set Up the Database

Finally, run the database migrations and seeders to set up the database schema and populate it with initial data:

```bash
docker exec -it hire-smart-app npm run setup:db
```

---

## ✅ Server Availability

Once the setup is complete, the server will be available at:

- **API Base URL:** `http://localhost:4000`
- **Swagger Docs:** `http://localhost:4000/api-doc` (available in development mode)

### Default Login Credentials

- **Admin:**
  - **Email:** `admin@mail.com`
  - **Password:** `defaultPass123!`
- **Employer:**
  - **Email:** `employer@mail.com`
  - **Password:** `defaultPass123!`
- **Candidate:**
  - **Email:** `candidate@mail.com`
  - **Password:** `defaultPass123!`

---

## 📜 NPM Scripts Overview

All scripts should be run inside the application container using `docker exec -it hire-smart-app <command>`.

| Script                                               | Description                            |
| :--------------------------------------------------- | :------------------------------------- |
| `npm run lint`                                       | Lints and auto-fixes TypeScript files. |
| `npm run format`                                     | Formats code using Prettier.           |
| `npm run migration:generate --name=<migration_name>` | Generates a new migration file.        |
| `npm run migration:run`                              | Applies all pending migrations.        |
| `npm run migration:revert`                           | Reverts the last applied migration.    |
| `npm run seed:generate --name=<seed_name>`           | Generates a new seed file.             |
| `npm run seed:run`                                   | Executes all seed scripts.             |

---

## Running the Project

After the initial setup, you can easily start and stop the project using:

```bash
# Start the services in detached mode
docker-compose up -d

# Stop the services
docker-compose down
```

---

## 🚀 Application Workflow

### User Registration and Authentication

- **New User Registration:** Users (Admin, Employer, Candidate) can register for an account.
- **Login:** Registered users can log in using their credentials.
- **Authentication:** JWT (JSON Web Tokens) are used for secure authentication.

### Job Management (Employer)

- **Create Job:** Employers can create new job postings, specifying details like title, description, required skills, and salary.
- **View Jobs:** Employers can view all their posted jobs.
- **Update Job:** Employers can modify details of their existing job postings.
- **Delete Job:** Employers can remove job postings.

### Profile and Preferences

- **Update password:** Anyone can update their password.
- **View profile:** Anyone can view their profile.

### Job Application (Candidate)

- **Browse Jobs:** Candidates can browse available job postings.
- **Apply for Job:** Candidates can apply for jobs that match their skills and preferences.
- **View Applications:** Candidates can view the status of their job applications.

### Job Matching and Notifications

- **Job Matching:** The system periodically matches new job postings with suitable candidates based on their skills and preferences.
- **Notifications:** Candidates receive notifications for new job matches and updates on their applications.

### Admin Functionality

- **Metric Monitoring:** Admins can view application metrics and system performance.

### Background Processes

- **Queue System:** Redis-backed queues handle background tasks such as job matching and sending notifications, ensuring the main application remains responsive.
- **Scheduled Tasks:** Scheduled tasks manage periodic operations like data synchronization or report generation.
