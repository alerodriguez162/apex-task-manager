# Apex Task Manager

Full Stack Task Manager built with an AI-assisted workflow for **Apex Bench — Week 1: AI-Assisted Development Foundations**.

## Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (`better-sqlite3`)

## API (Day 2)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks (`?status=&priority=`) |
| GET | `/api/tasks/:id` | Get task |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

Task fields: `title`, `description`, `status` (`todo` \| `in_progress` \| `done`), `priority` (`low` \| `medium` \| `high`).

## Daily plan

| Day | Branch | Focus |
|-----|--------|--------|
| 1 | `day-1-scaffold` | Monorepo scaffold, health API, client bootstrap |
| 2 | `day-2-api` | SQLite + REST CRUD for tasks |
| 3 | `day-3-frontend` | Task Manager UI shell |
| 4 | `day-4-integration` | Wire list/create to the API |
| 5 | `day-5-features` | Edit, delete, filters, priorities |
| 6 | `day-6-polish` | Validation, errors, production polish |

Workflow: one branch per day → merge into `main` at end of day.

## Frontend

**Day 3 — UI shell:** form + list with mock local data.

**Day 4 — Integration:** `GET /api/tasks` and `POST /api/tasks` wired from the client (loading + error states).

## Getting started

```bash
npm install
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:5173
```

Health check: `GET http://localhost:3001/api/health`
