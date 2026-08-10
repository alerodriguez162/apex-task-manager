import type { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from './types.js'

export type TaskFilters = {
  status?: TaskStatus
  priority?: TaskPriority
}

const tasks = new Map<string, Task>()

const priorityRank: Record<TaskPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
}

export function listTasks(filters: TaskFilters = {}): Task[] {
  return [...tasks.values()]
    .filter((task) => (filters.status ? task.status === filters.status : true))
    .filter((task) => (filters.priority ? task.priority === filters.priority : true))
    .sort((a, b) => {
      const byPriority = priorityRank[a.priority] - priorityRank[b.priority]
      if (byPriority !== 0) return byPriority
      return b.createdAt.localeCompare(a.createdAt)
    })
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id)
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
  tasks.set(task.id, task)
  return task
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const existing = tasks.get(id)
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
  tasks.set(id, updated)
  return updated
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id)
}
