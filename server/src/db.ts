import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.VERCEL
  ? path.join('/tmp', 'apex-task-manager')
  : path.join(__dirname, '..', 'data')
const dbPath = path.join(dataDir, 'tasks.db')

fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
`)

type TaskRow = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  created_at: string
  updated_at: string
}

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export type TaskFilters = {
  status?: TaskStatus
  priority?: TaskPriority
}

export function listTasks(filters: TaskFilters = {}): Task[] {
  const clauses: string[] = []
  const params: Record<string, string> = {}

  if (filters.status) {
    clauses.push('status = @status')
    params.status = filters.status
  }
  if (filters.priority) {
    clauses.push('priority = @priority')
    params.priority = filters.priority
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const rows = db
    .prepare(
      `SELECT id, title, description, status, priority, created_at, updated_at
       FROM tasks
       ${where}
       ORDER BY
         CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
         created_at DESC`,
    )
    .all(params) as TaskRow[]

  return rows.map(mapRow)
}

export function getTaskById(id: string): Task | undefined {
  const row = db
    .prepare(
      `SELECT id, title, description, status, priority, created_at, updated_at
       FROM tasks WHERE id = ?`,
    )
    .get(id) as TaskRow | undefined

  return row ? mapRow(row) : undefined
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString()
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim() || null,
    status: input.status ?? 'todo',
    priority: input.priority ?? 'medium',
    createdAt: now,
    updatedAt: now,
  }

  db.prepare(
    `INSERT INTO tasks (id, title, description, status, priority, created_at, updated_at)
     VALUES (@id, @title, @description, @status, @priority, @createdAt, @updatedAt)`,
  ).run(task)

  return task
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const existing = getTaskById(id)
  if (!existing) return undefined

  const updated: Task = {
    ...existing,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    description:
      input.description !== undefined
        ? input.description?.trim() || null
        : existing.description,
    status: input.status ?? existing.status,
    priority: input.priority ?? existing.priority,
    updatedAt: new Date().toISOString(),
  }

  db.prepare(
    `UPDATE tasks
     SET title = @title,
         description = @description,
         status = @status,
         priority = @priority,
         updated_at = @updatedAt
     WHERE id = @id`,
  ).run(updated)

  return updated
}

export function deleteTask(id: string): boolean {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
  return result.changes > 0
}
