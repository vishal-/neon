import { Hono } from 'hono'
import { getDb } from '../db'
import { createAuth, type AuthEnv } from '../lib/auth'
import {
  awardXp,
  getUserXp,
  getXpTransactions,
  XP_ACTIVITY_TYPES,
  type XpActivityType,
} from '../lib/xp'

export type XpApiEnv = {
  Bindings: AuthEnv
}

export const xpApi = new Hono<XpApiEnv>()

/**
 * GET /api/xp/me
 * Returns the current authenticated user's XP summary and recent ledger transactions.
 */
xpApi.get('/me', async (c) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized', message: 'Sign in to view XP records' }, 401)
  }

  const db = getDb(c.env)
  const [xpData, history] = await Promise.all([
    getUserXp(db, session.user.id),
    getXpTransactions(db, session.user.id, 15),
  ])

  return c.json({
    success: true,
    totalXp: xpData.totalXp,
    level: xpData.level,
    history,
  })
})

/**
 * POST /api/xp/award
 * Awards XP to the authenticated user for completing an activity.
 */
xpApi.post('/award', async (c) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized', message: 'Sign in to earn XP' }, 401)
  }

  // Critical fix: Prevent arbitrary client XP self-awarding. Restrict manual award endpoint strictly to Boss admins.
  if (!session.user.isBoss) {
    return c.json(
      { error: 'Forbidden', message: 'Admin privileges required to manually award XP.' },
      403
    )
  }

  const body = await c.req.json().catch(() => ({}))
  const { amount, activityType, activityId, description, metadata, userId: targetUserId } = body

  if (typeof amount !== 'number' || amount <= 0) {
    return c.json({ error: 'Validation Error', message: 'Valid positive amount required' }, 400)
  }

  if (!XP_ACTIVITY_TYPES.includes(activityType as XpActivityType)) {
    return c.json(
      {
        error: 'Validation Error',
        message: `Invalid activityType. Allowed types: ${XP_ACTIVITY_TYPES.join(', ')}`,
      },
      400
    )
  }

  if (!description || typeof description !== 'string') {
    return c.json({ error: 'Validation Error', message: 'Description is required' }, 400)
  }

  try {
    const db = getDb(c.env)
    const recipientUserId =
      typeof targetUserId === 'string' && targetUserId.trim()
        ? targetUserId.trim()
        : session.user.id

    const result = await awardXp(db, {
      userId: recipientUserId,
      amount: Math.min(amount, 1000), // Cap single transaction at 1000 XP
      activityType: activityType as XpActivityType,
      activityId: activityId ? String(activityId) : undefined,
      description: description.trim(),
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : undefined,
    })

    return c.json({
      success: true,
      message: `🎉 Earned +${result.awarded} Cosmic XP!`,
      awarded: result.awarded,
      totalXp: result.totalXp,
      level: result.level,
      transactionId: result.transactionId,
    })
  } catch (err: any) {
    return c.json(
      {
        error: 'Database Error',
        message: err?.message || 'Failed to award XP in ledger',
      },
      500
    )
  }
})
