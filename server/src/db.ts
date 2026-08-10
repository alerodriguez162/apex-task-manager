import type { CreateTaskInput, Task, UpdateTaskInput } from './types.js'

export type TaskFilters = {
  status?: import('./types.js').TaskStatus
  priority?: import('./types.js').TaskPriority
}

type TaskStore = {
  listTasks: (filters?: TaskFilters) => Task[]
  getTaskById: (id: string) => Task | undefined
  createTask: (input: CreateTaskInput) => Task
  updateTask: (id: string, input: UpdateTaskInput) => Task | undefined
  deleteTask: (id: string) => boolean
}

const store: TaskStore = process.env.VERCEL
  ? await import('./db-memory.js')
  : await import('./db-sqlite.js')

export const listTasks = store.listTasks
export const getTaskById = store.getTaskById
export const createTask = store.createTask
export const updateTask = store.updateTask
export const deleteTask = store.deleteTask
