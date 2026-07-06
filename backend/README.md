# Todo List Backend

A robust, RESTful API backend built with Express, Node.js, and TypeScript, structured using the Controller-Service-Repository pattern.

---

## 🔍 Overview

The backend service serves as the core business logic layer of the Todo List application. It parses incoming queries, performs payload structure validation, connects to a PostgreSQL database using Prisma ORM, and handles general server-side exceptions.

---

## 🏗️ Architecture

The backend project utilizes a structured **Controller-Service-Repository** pattern:

- **Routes**: Listens on public HTTP endpoints and maps them to controllers.
- **Controllers**: Responsible for extracting inputs, validating parameters with Zod schemas, returning API responses, and forwarding uncaught exceptions.
- **Services**: Contains business rules (e.g. calculation of pagination metrics, searching conditions, status updates) and issues queries directly to the Prisma Client.
- **Database (PostgreSQL)**: Stores task models with custom GIN index layers for rapid query filtering.

---

## 🛠️ Tech Stack

- **Server Framework**: Express, Node.js
- **Language**: TypeScript
- **ORM**: Prisma Client (v5+)
- **Validation**: Zod
- **Testing**: Jest, ts-jest (for Unit Testing)
- **Database**: PostgreSQL

---

## 📂 Folder Structure

```text
backend/
├── prisma/
│   ├── migrations/         # PostgreSQL schema migration history
│   └── schema.prisma       # Database design, model entities, and extensions
├── src/
│   ├── controllers/        # Request handlers & Zod schemas
│   ├── lib/                # Shared utilities (Prisma Client singleton)
│   ├── middlewares/        # Custom Express error and routing middlewares
│   ├── routes/             # REST endpoint routing definitions
│   ├── services/           # DB transactional logic & calculations
│   │   ├── task.service.ts
│   │   └── task.service.test.ts # Jest unit test suites
│   └── index.ts            # Entrypoint file
├── Dockerfile              # Lightweight container setup
└── package.json
```

---

## ⚙️ Environment Variables

Create a file named `.env` in the `backend` directory. Refer to the structure below:

```env
# Connection string to PostgreSQL database
DATABASE_URL="postgresql://postgres:root@localhost:5432/todo_db?schema=public"

# Running Port
PORT=3001
```

---

## 🚀 Installation

Ensure you have [Node.js](https://nodejs.org/) and a PostgreSQL instance running.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependency packages:
   ```bash
   npm install
   ```

---

## 🗄️ Database Setup

1. Sync databases and apply existing migrations:
   ```bash
   npx prisma migrate dev
   ```

2. Generate client structures:
   ```bash
   npx prisma generate
   ```

---

## 💻 Run Development

To launch the hot-reload server using `ts-node-dev`:

```bash
npm run dev
```

The API will listen at [http://localhost:3001](http://localhost:3001).

---

## 🏗️ Build

To compile TypeScript source files into executable JavaScript:

```bash
npm run build
```

This generates compiled modules inside the `dist/` directory.

To run the production build:
```bash
node dist/index.js
```

---

## 🧪 Run Tests

To run Jest unit test suites:

```bash
npm run test
```

---

## 📖 API Documentation

> Replace with your information (e.g. Swagger UI or Postman Collection links)

### Endpoints List

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Server status check |
| **GET** | `/api/tasks` | Fetch list of tasks with filters, search, and pagination |
| **GET** | `/api/tasks/:id` | Get details of a single task |
| **POST** | `/api/tasks` | Create a new task |
| **PUT** | `/api/tasks/:id` | Update task details (title, description, due date) |
| **PATCH** | `/api/tasks/:id/status` | Update task status (TODO or DONE) |
| **DELETE** | `/api/tasks/:id` | Remove a task |

---

## 🛡️ Validation

Incoming requests are strictly validated using **Zod** schemas inside the controllers:
- Input sanitization (e.g. `.trim()` for title strings).
- Character limits (`max(200)` for titles and `max(1000)` for descriptions).
- Formatting checks (Due dates are validated against ISO-8601 strings).
- Request pagination queries (`page`, `limit`) are validated and parsed into positive integers.

---

## 🚨 Error Handling

All uncaught exceptions are centralized inside the [error.middleware.ts](./src/middlewares/error.middleware.ts) middleware:
- Safe messages: Standardized error format responses (returns general "Internal server error" for 500 exceptions, hiding sensitive DB credentials or query stacks).
- Logs: Raw stack traces are printed to `console.error` only for internal server errors.

---

## 📊 Logging

- Internal server errors print full traces.
- Client warning parameters (404 Not Found, 400 Bad Request) print a clean one-line message:
  ```text
  Client Warning [404]: Route not found: GET / - GET /
  ```

---

## 🔮 Future Improvements

- Add request rate-limiting middleware to avoid DOS attacks.
- Add pg_trgm trigram indices details inside the migrations description.
