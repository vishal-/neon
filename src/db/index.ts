import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export * from './schema'

export interface TursoEnv {
  TURSO_DATABASE_URL?: string
  TURSO_AUTH_TOKEN?: string
}

export function getDb(env?: TursoEnv) {
  const url =
    env?.TURSO_DATABASE_URL ||
    (typeof process !== 'undefined' ? process.env?.TURSO_DATABASE_URL : '') ||
    'file:local.db'

  const authToken =
    env?.TURSO_AUTH_TOKEN ||
    (typeof process !== 'undefined' ? process.env?.TURSO_AUTH_TOKEN : '') ||
    undefined

  const client = createClient({
    url,
    authToken,
  })

  return drizzle(client, { schema })
}

export type Database = ReturnType<typeof getDb>
