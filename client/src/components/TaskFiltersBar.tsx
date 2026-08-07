import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '../types'
import type { TaskFilters } from '../api'

export type UiFilters = TaskFilters & {
  q?: string
}

type TaskFiltersBarProps = {
  filters: UiFilters
  onChange: (filters: UiFilters) => void
  disabled?: boolean
}

export function TaskFiltersBar({ filters, onChange, disabled = false }: TaskFiltersBarProps) {
  const hasActive = Boolean(filters.status || filters.priority || filters.q)

  return (
    <div className="filters">
      <label className="filter-search">
        Buscar
        <input
          type="search"
          value={filters.q ?? ''}
          disabled={disabled}
          placeholder="Título o descripción"
          onChange={(e) =>
            onChange({
              ...filters,
              q: e.target.value || undefined,
            })
          }
        />
      </label>

      <label>
        Estado
        <select
          value={filters.status ?? ''}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...filters,
              status: (e.target.value || undefined) as TaskStatus | undefined,
            })
          }
        >
          <option value="">Todos</option>
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
          value={filters.priority ?? ''}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: (e.target.value || undefined) as TaskPriority | undefined,
            })
          }
        >
          <option value="">Todas</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>

      {hasActive && (
        <button
          type="button"
          className="linkish"
          disabled={disabled}
          onClick={() => onChange({})}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
