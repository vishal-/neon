import { Hono } from 'hono'
import { renderer } from './renderer'
import { HomePage } from './components/pages/home'
import { LoginPage } from './components/pages/login'
import { ProfilePage } from './components/pages/profile'
import { eq } from 'drizzle-orm'
import { getDb, user as userTable } from './db'
import { checkApi } from './api/check'
import { profileApi } from './api/profile'
import { createAuth, type AuthEnv } from './lib/auth'
import { authGuard, sessionMiddleware } from './lib/auth-guard'
import type { User, Session } from './db/schema/auth'

export type AppEnv = {
  Bindings: AuthEnv
  Variables: {
    user?: User | null
    session?: Session | null
  }
}

const app = new Hono<AppEnv>()

// Better Auth API Handler
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

// Custom API Routes
app.route('/api/check', checkApi)
app.route('/api/profile', profileApi)

// Server-side Rendered Pages
app.use(renderer)

app.get('/', sessionMiddleware, (c) => {
  return c.render(<HomePage />)
})

app.get('/login', (c) => {
  return c.render(<LoginPage />, { title: 'Login — Neon Activities 🧑‍🚀' })
})

app.get('/profile', authGuard, (c) => {
  const user = c.get('user')!
  const updated = c.req.query('updated') === '1'
  const error = c.req.query('error')
  const title = user.name ? `${user.name} — Cadet Profile 🧑‍🚀` : 'Cadet Profile — Neon Activities 🧑‍🚀'
  return c.render(<ProfilePage user={user} updated={updated} error={error} />, { title })
})

app.post('/profile', authGuard, async (c) => {
  const user = c.get('user')!
  const body = await c.req.parseBody<{ name?: string }>()
  const newName = (body.name || '').trim()

  if (!newName) {
    return c.redirect('/profile?error=' + encodeURIComponent('Cadet name cannot be empty'))
  }

  if (newName.length > 50) {
    return c.redirect('/profile?error=' + encodeURIComponent('Cadet name cannot exceed 50 characters'))
  }

  try {
    const db = getDb(c.env)
    await db
      .update(userTable)
      .set({
        name: newName,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, user.id))

    return c.redirect('/profile?updated=1')
  } catch (err: any) {
    return c.redirect('/profile?error=' + encodeURIComponent(err?.message || 'Failed to update name'))
  }
})

app.post('/logout', async (c) => {
  try {
    const auth = createAuth(c.env)
    await auth.api.signOut({ headers: c.req.raw.headers })
  } catch (_e) {
    // Session cleanup fallback
  }
  return c.redirect('/login')
})

export default app
