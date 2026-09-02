import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { getDb, user as userTable } from '../db'
import { createAuth, type AuthEnv } from '../lib/auth'

export type ProfileEnv = {
  Bindings: AuthEnv
}

export const profileApi = new Hono<ProfileEnv>()

/**
 * GET /api/profile
 * Returns the current authenticated cadet's profile information.
 */
profileApi.get('/', async (c) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized', message: 'You must be signed in to view your profile' }, 401)
  }

  const db = getDb(c.env)
  const dbUser = await db.query?.user?.findFirst?.({
    where: eq(userTable.id, session.user.id),
  }) || session.user

  const email = session.user.email
  const avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`

  return c.json({
    success: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatarUrl,
      emailVerified: session.user.emailVerified,
      createdAt: session.user.createdAt,
    },
  })
})

/**
 * PATCH /api/profile
 * Updates the current cadet's profile name in the database.
 */
profileApi.patch('/', async (c) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized', message: 'You must be signed in to update your profile' }, 401)
  }

  const body = await c.req.json().catch(() => ({}))
  const newName = (body.name || '').trim()

  if (!newName) {
    return c.json({ error: 'Validation Error', message: 'Name cannot be empty' }, 400)
  }

  if (newName.length > 50) {
    return c.json({ error: 'Validation Error', message: 'Name cannot exceed 50 characters' }, 400)
  }

  try {
    const db = getDb(c.env)
    await db
      .update(userTable)
      .set({
        name: newName,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id))

    return c.json({
      success: true,
      message: 'Cadet name updated successfully!',
      user: {
        id: session.user.id,
        name: newName,
        email: session.user.email,
      },
    })
  } catch (err: any) {
    return c.json(
      {
        error: 'Database Error',
        message: err?.message || 'Failed to update cadet profile in database',
      },
      500
    )
  }
})

