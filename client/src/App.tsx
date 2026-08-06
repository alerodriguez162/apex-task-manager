import { useEffect, useState } from 'react'
import { createTask, fetchTasks } from './api'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import type { Task, TaskDraft } from './types'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    fetchTasks()
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(draft: TaskDraft) {
    setCreating(true)
    setError(null)
    try {
      const task = await createTask(draft)
      setTasks((current) => [task, ...current])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la tarea'
      setError(message)
      throw err instanceof Error ? err : new Error(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Apex Bench · Week 1</p>
        <h1>Task Manager</h1>
        <p className="lede">
          Día 4: listado y creación conectados a la API REST.
        </p>
      </header>

      {error && (
        <p className="banner error" role="alert">
          {error}
        </p>
      )}

      <TaskForm onSubmit={handleCreate} disabled={creating} />

      <section className="task-list" aria-live="polite">
        <div className="task-list-header">
          <h2>Tareas</h2>
          <span className="task-count">{loading ? '…' : tasks.length}</span>
        </div>

        {loading ? (
          <p className="empty">Cargando tareas…</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No hay tareas todavía. Crea la primera arriba.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem task={task} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
