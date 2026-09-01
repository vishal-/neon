import { Hono } from 'hono'
import { renderer } from './renderer'

import { HomePage } from './components/pages/home'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<HomePage />)
})

export default app
