import { eq, desc, and } from 'drizzle-orm'
import {
  xpTransactions,
  userXp,
  XP_ACTIVITY_TYPES,
  type Database,
  type XpActivityType,
} from '../db'

export { XP_ACTIVITY_TYPES, type XpActivityType }

/**
 * Calculates cadet level based on total XP.
 * Default progression: 500 XP per level.
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1
  return Math.floor(totalXp / 500) + 1
}

export interface AwardXpParams {
  userId: string
  amount: number
  activityType: XpActivityType
  activityId?: string
  description: string
  metadata?: Record<string, unknown>
}

export interface AwardXpResult {
  success: boolean
  awarded: number
  totalXp: number
  level: number
  transactionId: string
}

/**
 * Awards XP to a cadet for completing any activity.
 * Records an immutable entry in xp_transactions and updates the user_xp aggregate.
 */
export async function awardXp(
  db: Database,
  params: AwardXpParams
): Promise<AwardXpResult> {
  const { userId, amount, activityType, activityId, description, metadata } = params

  if (amount <= 0) {
    throw new Error('XP award amount must be greater than 0')
  }

  // Idempotency check: prevent duplicate XP awards for the same activity
  if (activityId) {
    const [existingTx] = await db
      .select()
      .from(xpTransactions)
      .where(
        and(
          eq(xpTransactions.userId, userId),
          eq(xpTransactions.activityType, activityType),
          eq(xpTransactions.activityId, activityId)
        )
      )
      .limit(1)

    if (existingTx) {
      const userXpRow = await getUserXp(db, userId)
      return {
        success: true,
        awarded: 0,
        totalXp: userXpRow.totalXp,
        level: userXpRow.level,
        transactionId: existingTx.id,
      }
    }
  }

  // 1. Insert transaction into the immutable ledger
  const [tx] = await db
    .insert(xpTransactions)
    .values({
      userId,
      amount,
      activityType,
      activityId,
      description,
      metadata,
    })
    .returning()

  // 2. Fetch or initialize existing user XP
  const [existingUserXp] = await db
    .select()
    .from(userXp)
    .where(eq(userXp.userId, userId))

  const newTotal = (existingUserXp?.totalXp || 0) + amount
  const newLevel = calculateLevel(newTotal)

  if (existingUserXp) {
    await db
      .update(userXp)
      .set({
        totalXp: newTotal,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(userXp.userId, userId))
  } else {
    await db.insert(userXp).values({
      userId,
      totalXp: newTotal,
      level: newLevel,
    })
  }

  return {
    success: true,
    awarded: amount,
    totalXp: newTotal,
    level: newLevel,
    transactionId: tx.id,
  }
}

/**
 * Retrieves the total XP and level for a cadet.
 */
export async function getUserXp(
  db: Database,
  userId: string
): Promise<{ totalXp: number; level: number }> {
  const [record] = await db
    .select()
    .from(userXp)
    .where(eq(userXp.userId, userId))

  return {
    totalXp: record?.totalXp ?? 0,
    level: record?.level ?? 1,
  }
}

/**
 * Retrieves the recent XP transactions for a cadet.
 */
export async function getXpTransactions(
  db: Database,
  userId: string,
  limit = 20
) {
  return db
    .select()
    .from(xpTransactions)
    .where(eq(xpTransactions.userId, userId))
    .orderBy(desc(xpTransactions.createdAt))
    .limit(limit)
}
