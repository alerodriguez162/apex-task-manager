import { useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import type { Task, TaskDraft } from './types'
import './App.css'

const MOCK_TASKS: Task[] = [
  {
    id: 'mock-1',
    title: 'Diseñar shell del Task Manager',
    description: 'Layout, formulario y lista con datos locales.',
    status: 'done',
    priority: 'high',
    createdAt: '2026-08-05T14:00:00.000Z',
    updatedAt: '2026-08-05T15:00:00.000Z',
  },
  {
    id: 'mock-2',
    title: 'Conectar listado a la API',
    description: 'Pendiente para el día 4.',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-08-05T14:10:00.000Z',
    updatedAt: '2026-08-05T14:10:00.000Z',
  },
  {
    id: 'mock-3',
    title: 'Revisar prioridades en la UI',
    description: null,
    status: 'in_progress',
    priority: 'low',
    createdAt: '2026-08-05T14:20:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
  },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)

  function handleCreate(draft: TaskDraft) {
    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      title: draft.title,
      description: draft.description || null,
      status: draft.status,
      priority: draft.priority,
      createdAt: now,
      updatedAt: now,
    }
    setTasks((current) => [task, ...current])
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Apex Bench · Week 1</p>
        <h1>Task Manager</h1>
        <p className="lede">
          Día 3: shell de UI con formulario, lista y datos mock locales.
        </p>
      </header>

      <TaskForm onSubmit={handleCreate} />

      <section className="task-list" aria-live="polite">
        <div className="task-list-header">
          <h2>Tareas</h2>
          <span className="task-count">{tasks.length}</span>
        </div>

        {tasks.length === 0 ? (
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
