import { useState, type FormEvent } from 'react'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
} from '../types'
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  hasFieldErrors,
  validateDraft,
  type FieldErrors,
} from '../validation'

type TaskItemProps = {
  task: Task
  busy?: boolean
  onUpdate: (id: string, draft: TaskDraft) => Promise<void>
  onAdvanceStatus: (id: string, status: TaskStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function nextStatus(status: TaskStatus): TaskStatus {
  if (status === 'todo') return 'in_progress'
  if (status === 'in_progress') return 'done'
  return 'todo'
}

export function TaskItem({
  task,
  busy = false,
  onUpdate,
  onAdvanceStatus,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [draft, setDraft] = useState<TaskDraft>({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
  })

  function startEdit() {
    setDraft({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
    })
    setErrors({})
    setEditing(true)
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (busy) return

    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)
    if (hasFieldErrors(nextErrors)) return

    await onUpdate(task.id, {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    })
    setEditing(false)
    setErrors({})
  }

  async function handleDelete() {
    if (busy) return
    if (!window.confirm(`¿Eliminar “${task.title}”?`)) return
    await onDelete(task.id)
  }

  async function handleAdvance() {
    if (busy || editing) return
    await onAdvanceStatus(task.id, nextStatus(task.status))
  }

  if (editing) {
    return (
      <article className={`task-item editing priority-${draft.priority}`}>
        <form className="task-edit" onSubmit={handleSave} noValidate>
          <label className={errors.title ? 'has-error' : undefined}>
            Título
            <input
              type="text"
              value={draft.title}
              disabled={busy}
              maxLength={TITLE_MAX}
              aria-invalid={Boolean(errors.title)}
              onChange={(e) => {
                setDraft((d) => ({ ...d, title: e.target.value }))
                setErrors((current) => ({ ...current, title: undefined }))
              }}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </label>
          <label className={errors.description ? 'has-error' : undefined}>
            Descripción
            <textarea
              value={draft.description}
              disabled={busy}
              rows={2}
              maxLength={DESCRIPTION_MAX}
              aria-invalid={Boolean(errors.description)}
              onChange={(e) => {
                setDraft((d) => ({ ...d, description: e.target.value }))
                setErrors((current) => ({ ...current, description: undefined }))
              }}
            />
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </label>
          <div className="form-row">
            <label>
              Estado
              <select
                value={draft.status}
                disabled={busy}
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
                value={draft.priority}
                disabled={busy}
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
          <div className="task-actions">
            <button type="submit" disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              type="button"
              className="ghost"
              disabled={busy}
              onClick={() => {
                setEditing(false)
                setErrors({})
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </article>
    )
  }

  return (
    <article className={`task-item priority-${task.priority} status-${task.status}`}>
      <div className="task-item-header">
        <h3>{task.title}</h3>
        <span className={`badge priority priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        <button
          type="button"
          className={`badge status status-${task.status} status-chip`}
          disabled={busy}
          title={`Pasar a: ${STATUS_LABELS[nextStatus(task.status)]}`}
          onClick={handleAdvance}
        >
          {STATUS_LABELS[task.status]}
        </button>
        <div className="task-actions">
          <button type="button" className="ghost" disabled={busy} onClick={startEdit}>
            Editar
          </button>
          <button type="button" className="ghost danger" disabled={busy} onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
