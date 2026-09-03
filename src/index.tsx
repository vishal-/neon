import { Hono } from 'hono'
import { checkApi } from './api/check'
import { profileApi } from './api/profile'
import { otpApi } from './api/otp'
import { bossApi } from './api/boss'
import { xpApi } from './api/xp'
import { quizzesApi } from './api/quizzes'
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

// Custom REST API Routes
app.route('/api/check', checkApi)
app.route('/api/profile', profileApi)
app.route('/api/otp', otpApi)
app.route('/api/boss', bossApi)
app.route('/api/xp', xpApi)
app.route('/api/quizzes', quizzesApi)

export default app

