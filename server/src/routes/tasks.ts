import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from '../db.js'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '../types.js'

const router = Router()

function isStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && TASK_STATUSES.includes(value as TaskStatus)
}

function isPriority(value: unknown): value is TaskPriority {
  return typeof value === 'string' && TASK_PRIORITIES.includes(value as TaskPriority)
}

router.get('/', (req, res) => {
  const { status, priority } = req.query

  if (status !== undefined && !isStatus(status)) {
    res.status(400).json({ error: 'Invalid status filter' })
    return
  }
  if (priority !== undefined && !isPriority(priority)) {
    res.status(400).json({ error: 'Invalid priority filter' })
    return
  }

  const tasks = listTasks({
    status: status as TaskStatus | undefined,
    priority: priority as TaskPriority | undefined,
  })
  res.json(tasks)
})

router.get('/:id', (req, res) => {
  const task = getTaskById(req.params.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
})

router.post('/', (req, res) => {
  const { title, description, status, priority } = req.body ?? {}

  if (typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Title is required' })
    return
  }
  if (status !== undefined && !isStatus(status)) {
    res.status(400).json({ error: 'Invalid status' })
    return
  }
  if (priority !== undefined && !isPriority(priority)) {
    res.status(400).json({ error: 'Invalid priority' })
    return
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    res.status(400).json({ error: 'Description must be a string or null' })
    return
  }

  const task = createTask({ title, description, status, priority })
  res.status(201).json(task)
})

router.patch('/:id', (req, res) => {
  const { title, description, status, priority } = req.body ?? {}

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    res.status(400).json({ error: 'Title cannot be empty' })
    return
  }
  if (status !== undefined && !isStatus(status)) {
    res.status(400).json({ error: 'Invalid status' })
    return
  }
  if (priority !== undefined && !isPriority(priority)) {
    res.status(400).json({ error: 'Invalid priority' })
    return
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    res.status(400).json({ error: 'Description must be a string or null' })
    return
  }

  const task = updateTask(req.params.id, { title, description, status, priority })
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
})

router.delete('/:id', (req, res) => {
  const deleted = deleteTask(req.params.id)
  if (!deleted) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.status(204).send()
})

export default router
