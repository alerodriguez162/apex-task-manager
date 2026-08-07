import { useEffect, useMemo, useState } from 'react'
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  type TaskFilters,
} from './api'
import { TaskFiltersBar, type UiFilters } from './components/TaskFiltersBar'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import type { Task, TaskDraft, TaskStatus } from './types'
import './App.css'

type Notice = {
  type: 'error' | 'success'
  message: string
}

function filtersFromUrl(): UiFilters {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status')
  const priority = params.get('priority')
  const q = params.get('q')?.trim()

  return {
    status:
      status === 'todo' || status === 'in_progress' || status === 'done'
        ? status
        : undefined,
    priority:
      priority === 'low' || priority === 'medium' || priority === 'high'
        ? priority
        : undefined,
    q: q || undefined,
  }
}

function syncUrl(filters: UiFilters) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.q) params.set('q', filters.q)
  const query = params.toString()
  const next = query ? `?${query}` : window.location.pathname
  window.history.replaceState(null, '', next)
}

function apiFilters(filters: UiFilters): TaskFilters {
  return {
    status: filters.status,
    priority: filters.priority,
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<UiFilters>(() => filtersFromUrl())
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [creating, setCreating] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    syncUrl(filters)
  }, [filters])

  useEffect(() => {
    let cancelled = false
    const query = apiFilters(filters)

    setLoading(true)
    fetchTasks(query)
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setNotice({ type: 'error', message: err.message })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters.status, filters.priority])

  const visibleTasks = useMemo(() => {
    const q = filters.q?.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter((task) => {
      const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [tasks, filters.q])

  const stats = useMemo(() => {
    return visibleTasks.reduce(
      (acc, task) => {
        acc[task.status] += 1
        return acc
      },
      { todo: 0, in_progress: 0, done: 0 },
    )
  }, [visibleTasks])

  function matchesFilters(task: Task) {
    const matchesStatus = !filters.status || task.status === filters.status
    const matchesPriority = !filters.priority || task.priority === filters.priority
    return matchesStatus && matchesPriority
  }

  async function handleCreate(draft: TaskDraft) {
    setCreating(true)
    setNotice(null)
    try {
      const task = await createTask(draft)
      if (matchesFilters(task)) {
        setTasks((current) => [task, ...current])
      }
      setNotice({ type: 'success', message: 'Tarea creada.' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la tarea'
      setNotice({ type: 'error', message })
      throw err instanceof Error ? err : new Error(message)
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdate(id: string, draft: TaskDraft) {
    setBusyId(id)
    setNotice(null)
    try {
      const task = await updateTask(id, draft)
      setTasks((current) => {
        if (!matchesFilters(task)) {
          return current.filter((item) => item.id !== id)
        }
        return current.map((item) => (item.id === id ? task : item))
      })
      setNotice({ type: 'success', message: 'Tarea actualizada.' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la tarea'
      setNotice({ type: 'error', message })
      throw err instanceof Error ? err : new Error(message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleAdvanceStatus(id: string, status: TaskStatus) {
    setBusyId(id)
    setNotice(null)
    try {
      const task = await updateTask(id, { status })
      setTasks((current) => {
        if (!matchesFilters(task)) {
          return current.filter((item) => item.id !== id)
        }
        return current.map((item) => (item.id === id ? task : item))
      })
      setNotice({ type: 'success', message: 'Estado actualizado.' })
    } catch (err) {
      setNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al cambiar el estado',
      })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    setNotice(null)
    try {
      await deleteTask(id)
      setTasks((current) => current.filter((item) => item.id !== id))
      setNotice({ type: 'success', message: 'Tarea eliminada.' })
    } catch (err) {
      setNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al eliminar la tarea',
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Apex Bench · Week 1</p>
        <h1>Task Manager</h1>
        <p className="lede">
          Día 6: validación, feedback, búsqueda y polish de producción.
        </p>
      </header>

      {notice && (
        <div className={`banner ${notice.type}`} role="status">
          <p>{notice.message}</p>
          <button type="button" className="linkish" onClick={() => setNotice(null)}>
            Cerrar
          </button>
        </div>
      )}

      <TaskForm onSubmit={handleCreate} disabled={creating} />

      <section className="task-list" aria-live="polite">
        <div className="task-list-header">
          <h2>Tareas</h2>
          <span className="task-count">{loading ? '…' : visibleTasks.length}</span>
        </div>

        <div className="stats" aria-label="Resumen por estado">
          <span>Por hacer {stats.todo}</span>
          <span>En progreso {stats.in_progress}</span>
          <span>Hechas {stats.done}</span>
        </div>

        <TaskFiltersBar
          filters={filters}
          onChange={setFilters}
          disabled={loading}
        />

        {loading ? (
          <div className="skeleton-list" aria-hidden="true">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty">
              {filters.status || filters.priority || filters.q
                ? 'No hay tareas con esos filtros.'
                : 'No hay tareas todavía. Crea la primera arriba.'}
            </p>
            {(filters.status || filters.priority || filters.q) && (
              <button type="button" className="linkish" onClick={() => setFilters({})}>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <ul>
            {visibleTasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  busy={busyId === task.id}
                  onUpdate={handleUpdate}
                  onAdvanceStatus={handleAdvanceStatus}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
