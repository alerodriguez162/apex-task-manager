import type { Task, TaskDraft } from './types'

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks')
  if (!res.ok) {
    throw new Error(`No se pudieron cargar las tareas (HTTP ${res.status})`)
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
    let message = `No se pudo crear la tarea (HTTP ${res.status})`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // keep default message
    }
    throw new Error(message)
  }

  return res.json() as Promise<Task>
}
