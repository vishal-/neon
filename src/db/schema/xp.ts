import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

/**
 * Universal Activity Types that can reward XP across Neon Activities.
 */
export const XP_ACTIVITY_TYPES = [
  'quiz',
  'memory_game',
  'riddle',
  'maze',
  'daily_quest',
  'bonus',
  'admin_grant',
] as const

export type XpActivityType = (typeof XP_ACTIVITY_TYPES)[number]

/**
 * XP Transactions Ledger Table
 * Immutable historical record of every XP award across all activity types.
 */
export const xpTransactions = sqliteTable('xp_transactions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  activityType: text('activity_type', { enum: XP_ACTIVITY_TYPES }).notNull(),
  activityId: text('activity_id'),
  description: text('description').notNull(),
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

/**
 * User XP Aggregate Table
 * Fast O(1) total XP and level lookup for profile, headers, and leaderboards.
 */
export const userXp = sqliteTable('user_xp', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  totalXp: integer('total_xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export type XpTransaction = typeof xpTransactions.$inferSelect
export type NewXpTransaction = typeof xpTransactions.$inferInsert

export type UserXp = typeof userXp.$inferSelect
export type NewUserXp = typeof userXp.$inferInsert
