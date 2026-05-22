# DevPulse 🚼

> Internal Tech Issue & Feature Tracker — a collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## 🌐 Live URL

```
https://devpulse-server-gules.vercel.app
```

---

## ✨ Features

- JWT-based authentication with role-based access control (`contributor` / `maintainer`)
- Create, read, update, and delete bug reports & feature requests
- Filter issues by `type` and `status`; sort by newest or oldest
- Password hashing via bcrypt (salt rounds: 10)
- Modular architecture with strict TypeScript — no `any` types
- Raw SQL only — no ORMs, no query builders, no JOINs

---

## 🛠️ Tech Stack

| Technology         | Version / Notes                     |
|--------------------|-------------------------------------|
| Node.js            | 24.x LTS                            |
| TypeScript         | 5.x (strict mode)                   |
| Express.js         | 4.x — modular router architecture   |
| PostgreSQL          | Native `pg` driver, raw SQL only    |
| bcrypt             | Salt rounds: 10                     |
| jsonwebtoken       | HS256 signed tokens, 7-day expiry   |
| http-status-codes  | Consistent HTTP status references   |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 24.x
- PostgreSQL database (local or NeonDB / Supabase / ElephantSQL)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/fardinislamselim/devpulse-server
cd devpulse

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 5. Start the development server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── config/
│   └── index.ts         # Configure environment variables
├── db/
│   └── index.ts         # pg Pool — shared connection pool & Table creation script
├── middleware/
│   ├── auth.ts          # JWT authenticate + authorise guards
│   └── errorHandler.ts  # Global error handler & 404 catcher
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   └── issues/
│       ├── issues.controller.ts
│       ├── issues.routes.ts
│       └── issues.service.ts
├── utils/
│   ├── jwt.ts           # signToken / verifyToken
│   ├── sendResponse.ts  # sendSuccess / sendError envelopes
│   ├── types.ts         # All shared TypeScript interfaces
│   └── validation.ts    # Input validation functions
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint          | Access  | Description              |
|--------|-------------------|---------|--------------------------|
| POST   | /api/auth/signup  | Public  | Register a new account   |
| POST   | /api/auth/login   | Public  | Login and receive a JWT  |

### Issues

| Method | Endpoint          | Access                          | Description                   |
|--------|-------------------|---------------------------------|-------------------------------|
| POST   | /api/issues       | Authenticated                   | Create a new issue            |
| GET    | /api/issues       | Public                          | List all issues (filterable)  |
| GET    | /api/issues/:id   | Public                          | Get a single issue            |
| PATCH  | /api/issues/:id   | Maintainer / own+open Contributor | Update an issue             |
| DELETE | /api/issues/:id   | Maintainer only                 | Delete an issue               |

#### GET /api/issues Query Params

| Param  | Values                    | Default |
|--------|---------------------------|---------|
| sort   | `newest`, `oldest`        | newest  |
| type   | `bug`, `feature_request`  | (none)  |
| status | `open`, `in_progress`, `resolved` | (none) |

---

## 🗄️ Database Schema

### users

| Column     | Type        | Constraints                             |
|------------|-------------|------------------------------------------|
| id         | SERIAL      | PRIMARY KEY                              |
| name       | VARCHAR(255)| NOT NULL                                 |
| email      | VARCHAR(255)| NOT NULL UNIQUE                          |
| password   | VARCHAR(255)| NOT NULL (bcrypt hashed)                 |
| role       | VARCHAR(20) | DEFAULT 'contributor', CHECK IN (contributor, maintainer) |
| created_at | TIMESTAMPTZ | DEFAULT NOW()                            |
| updated_at | TIMESTAMPTZ | DEFAULT NOW()                            |

### issues

| Column      | Type         | Constraints                              |
|-------------|--------------|-------------------------------------------|
| id          | SERIAL       | PRIMARY KEY                               |
| title       | VARCHAR(150) | NOT NULL                                  |
| description | TEXT         | NOT NULL (min 20 chars enforced in app)   |
| type        | VARCHAR(20)  | CHECK IN (bug, feature_request)           |
| status      | VARCHAR(20)  | DEFAULT 'open', CHECK IN (open, in_progress, resolved) |
| reporter_id | INTEGER      | NOT NULL (validated in app logic)         |
| created_at  | TIMESTAMPTZ  | DEFAULT NOW()                             |
| updated_at  | TIMESTAMPTZ  | DEFAULT NOW()                             |

---

## 🔐 Authentication

- Send credentials to `POST /api/auth/login` to receive a JWT
- Attach the token to protected requests via the `Authorization` header:

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🌍 Environment Variables

| Variable       | Description                        |
|----------------|------------------------------------|
| PORT           | Server port (default: 3000)        |
| DB_CONNECTION  | PostgreSQL connection string       |
| JWT_SECRET     | Secret key for signing JWTs        |
| JWT_EXPIRES_IN | Token expiry (default: 7d)         |
| NODE_ENV       | `development` or `production`      |
