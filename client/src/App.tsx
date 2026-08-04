import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
  service: string
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<HealthResponse>
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main className="app">
      <p className="eyebrow">Apex Bench · Week 1</p>
      <h1>Task Manager</h1>
      <p className="lede">
        Full Stack scaffold listo. Día 1: monorepo, API health y cliente React.
      </p>

      <section className="status" aria-live="polite">
        <h2>API status</h2>
        {error && <p className="error">Offline — {error}</p>}
        {health && (
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{health.status}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{health.service}</dd>
            </div>
            <div>
              <dt>Timestamp</dt>
              <dd>{health.timestamp}</dd>
            </div>
          </dl>
        )}
        {!health && !error && <p>Checking API…</p>}
      </section>
    </main>
  )
}

export default App
