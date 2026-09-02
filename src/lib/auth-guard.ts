import { createMiddleware } from 'hono/factory'
import { createAuth } from './auth'
import type { AppEnv } from '../index'

/**
 * Session Middleware:
 * Resolves Better Auth session from request headers and sets c.var.user & c.var.session.
 * Does not block unauthenticated requests.
 */
export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  try {
    const auth = createAuth(c.env)
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })
    c.set('user', session?.user || null)
    c.set('session', session?.session || null)
  } catch (e) {
    c.set('user', null)
    c.set('session', null)
  }
  await next()
})

/**
 * Auth Guard Middleware:
 * Protects private routes (like /profile).
 * If the user is unauthenticated, immediately redirects to /login?redirect=<path>.
 */
export const authGuard = createMiddleware<AppEnv>(async (c, next) => {
  try {
    const auth = createAuth(c.env)
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })
    if (!session || !session.user) {
      const redirectUrl = encodeURIComponent(c.req.path)
      return c.redirect(`/login?redirect=${redirectUrl}`)
    }
    c.set('user', session.user)
    c.set('session', session.session)
    await next()
  } catch (e) {
    const redirectUrl = encodeURIComponent(c.req.path)
    return c.redirect(`/login?redirect=${redirectUrl}`)
  }
})

