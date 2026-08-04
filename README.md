# Apex Task Manager

Full Stack Task Manager built with an AI-assisted workflow for **Apex Bench — Week 1: AI-Assisted Development Foundations**.

## Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (from Day 2)

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

## Getting started

```bash
npm install
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:5173
```

Health check: `GET http://localhost:3001/api/health`
