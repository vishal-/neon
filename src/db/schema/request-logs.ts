import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const requestLogs = sqliteTable('request_logs', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  method: text('method').notNull(),
  timestamp: text('timestamp').notNull(),
})

export type RequestLog = typeof requestLogs.$inferSelect
export type NewRequestLog = typeof requestLogs.$inferInsert
