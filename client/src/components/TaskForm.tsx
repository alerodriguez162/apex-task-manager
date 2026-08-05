import { useState, type FormEvent } from 'react'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
} from '../types'

type TaskFormProps = {
  onSubmit: (draft: TaskDraft) => void
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.title.trim()) return
    onSubmit({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    })
    setDraft(emptyDraft)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Nueva tarea</h2>

      <label>
        Título
        <input
          type="text"
          name="title"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Qué hay que hacer"
          required
          autoComplete="off"
        />
      </label>

      <label>
        Descripción
        <textarea
          name="description"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Detalles opcionales"
          rows={3}
        />
      </label>

      <div className="form-row">
        <label>
          Estado
          <select
            name="status"
            value={draft.status}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value as TaskStatus }))
            }
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prioridad
          <select
            name="priority"
            value={draft.priority}
            onChange={(e) =>
              setDraft((d) => ({ ...d, priority: e.target.value as TaskPriority }))
            }
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit">Agregar tarea</button>
    </form>
  )
}
