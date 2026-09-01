import { Hono } from 'hono'
import { renderer } from './renderer'
import { HomePage } from './components/pages/home'
import { checkApi, type Env } from './api/check'

const app = new Hono<Env>()

// API Routes
app.route('/api/check', checkApi)

// Server-side Rendered Pages
app.use(renderer)

app.get('/', (c) => {
  return c.render(<HomePage />)
})

export default app
