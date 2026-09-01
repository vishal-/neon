import { Hono } from 'hono'
import type { D1Database } from '@cloudflare/workers-types'
import { getDb, requestLogs } from '../db'

export type Env = {
  Bindings: {
    DB: D1Database
  }
}

export const checkApi = new Hono<Env>()

// Supports any HTTP method (GET, POST, etc.) for /api/check
checkApi.all('/', async (c) => {
  const method = c.req.method
  const timestamp = new Date().toISOString()
  const db = getDb(c.env.DB)

  try {
    // Ensure the table exists
    await c.env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS request_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )`
    ).run()

    // Type-safe insert using Drizzle ORM
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
        error: 'Failed to record request log via Drizzle ORM',
        message: err?.message || String(err),
        method,
        timestamp,
      },
      500
    )
  }
})
