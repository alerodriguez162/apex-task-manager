import cors from 'cors'
import express from 'express'
import tasksRouter from './routes/tasks.js'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'apex-task-manager-api',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/tasks', tasksRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})
