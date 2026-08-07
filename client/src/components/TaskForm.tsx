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
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  hasFieldErrors,
  validateDraft,
  type FieldErrors,
} from '../validation'

type TaskFormProps = {
  onSubmit: (draft: TaskDraft) => void | Promise<void>
  disabled?: boolean
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
}

export function TaskForm({ onSubmit, disabled = false }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft)
  const [errors, setErrors] = useState<FieldErrors>({})

  function updateField<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    if (key === 'title' || key === 'description') {
      setErrors((current) => ({ ...current, [key]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (disabled) return

    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)
    if (hasFieldErrors(nextErrors)) return

    await onSubmit({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    })
    setDraft(emptyDraft)
    setErrors({})
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>Nueva tarea</h2>

      <label className={errors.title ? 'has-error' : undefined}>
        Título
        <input
          type="text"
          name="title"
          value={draft.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Qué hay que hacer"
          maxLength={TITLE_MAX}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'create-title-error' : undefined}
        />
        {errors.title ? (
          <span id="create-title-error" className="field-error">
            {errors.title}
          </span>
        ) : (
          <span className="field-hint">{draft.title.length}/{TITLE_MAX}</span>
        )}
      </label>

      <label className={errors.description ? 'has-error' : undefined}>
        Descripción
        <textarea
          name="description"
          value={draft.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Detalles opcionales"
          rows={3}
          maxLength={DESCRIPTION_MAX}
          disabled={disabled}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'create-desc-error' : undefined}
        />
        {errors.description ? (
          <span id="create-desc-error" className="field-error">
            {errors.description}
          </span>
        ) : (
          <span className="field-hint">{draft.description.length}/{DESCRIPTION_MAX}</span>
        )}
      </label>

      <div className="form-row">
        <label>
          Estado
          <select
            name="status"
            value={draft.status}
            onChange={(e) => updateField('status', e.target.value as TaskStatus)}
            disabled={disabled}
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
            onChange={(e) => updateField('priority', e.target.value as TaskPriority)}
            disabled={disabled}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={disabled}>
        {disabled ? 'Guardando…' : 'Agregar tarea'}
      </button>
    </form>
  )
}
