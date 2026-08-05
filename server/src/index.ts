import cors from 'cors'
import express from 'express'
import tasksRouter from './routes/tasks.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

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

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
