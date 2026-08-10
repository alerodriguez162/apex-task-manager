import type { IncomingMessage, ServerResponse } from 'node:http'

type ExpressApp = (req: IncomingMessage, res: ServerResponse) => void

let appPromise: Promise<ExpressApp> | null = null

function loadApp() {
  if (!appPromise) {
    appPromise = import('../server/src/app.js').then((mod) => mod.app as ExpressApp)
  }
  return appPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await loadApp()
  return app(req, res)
}
