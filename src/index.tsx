import { Hono } from 'hono'
import { renderer } from './renderer'
import { HomePage } from './components/pages/home'
import { checkApi } from './api/check'
import { createAuth, type AuthEnv } from './lib/auth'

export type AppEnv = {
  Bindings: AuthEnv
}

const app = new Hono<AppEnv>()

// Better Auth API Handler
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

// Custom API Routes
app.route('/api/check', checkApi)

// Server-side Rendered Pages
app.use(renderer)

app.get('/', (c) => {
  return c.render(<HomePage />)
})

export default app
