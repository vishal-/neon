import { Hono } from 'hono'
import { getDb, requestLogs, type TursoEnv } from '../db'

export type Env = {
  Bindings: TursoEnv
}

export const checkApi = new Hono<Env>()

// Supports any HTTP method (GET, POST, etc.) for /api/check
checkApi.all('/', async (c) => {
  const method = c.req.method
  const timestamp = new Date().toISOString()
  const db = getDb(c.env)

  try {
    // Type-safe insert using Drizzle ORM with Turso
    const inserted = await db
      .insert(requestLogs)
      .values({
        method,
        timestamp,
      })
      .returning()

    const record = inserted[0]

    if (record) {
      return c.json({
        id: record.id,
        method: record.method,
        timestamp: record.timestamp,
      })
    }

    return c.json({
      id: 1,
      method,
      timestamp,
    })
  } catch (err: any) {
    return c.json(
      {
        error: 'Failed to record request log via Turso',
        message: err?.message || String(err),
        method,
        timestamp,
      },
      500
    )
  }
})
