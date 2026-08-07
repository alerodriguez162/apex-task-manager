import type { Task, TaskDraft, TaskPriority, TaskStatus } from './types'

export type TaskFilters = {
  status?: TaskStatus
  priority?: TaskPriority
}

function buildQuery(filters: TaskFilters = {}): string {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  const query = params.toString()
  return query ? `?${query}` : ''
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    if (body.error) return body.error
  } catch {
    // keep fallback
  }
  return fallback
}

export async function fetchTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const res = await fetch(`/api/tasks${buildQuery(filters)}`)
  if (!res.ok) {
    throw new Error(await readError(res, `No se pudieron cargar las tareas (HTTP ${res.status})`))
  }
  return res.json() as Promise<Task[]>
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: draft.title,
      description: draft.description || null,
      status: draft.status,
      priority: draft.priority,
    }),
  })

  if (!res.ok) {
    throw new Error(await readError(res, `No se pudo crear la tarea (HTTP ${res.status})`))
  }

  return res.json() as Promise<Task>
}

export async function updateTask(id: string, draft: Partial<TaskDraft>): Promise<Task> {
  const body: Record<string, unknown> = {}
  if (draft.title !== undefined) body.title = draft.title
  if (draft.description !== undefined) body.description = draft.description || null
  if (draft.status !== undefined) body.status = draft.status
  if (draft.priority !== undefined) body.priority = draft.priority

  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(await readError(res, `No se pudo actualizar la tarea (HTTP ${res.status})`))
  }

  return res.json() as Promise<Task>
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(await readError(res, `No se pudo eliminar la tarea (HTTP ${res.status})`))
  }
}
