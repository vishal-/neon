import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

/**
 * Reusable Question Bank Table
 * Stores standalone multiple-choice questions categorized by difficulty and topic.
 */
export const questions = sqliteTable('questions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  questionText: text('question_text').notNull(),
  options: text('options', { mode: 'json' }).$type<string[]>().notNull(),
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] })
    .notNull()
    .default('medium'),
  category: text('category'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

/**
 * Quiz Contests Metadata Table
 * Represents a quiz or competitive contest activity.
 */
export const quizzes = sqliteTable('quizzes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  category: text('category'),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] })
    .notNull()
    .default('medium'),
  timeLimitSeconds: integer('time_limit_seconds').notNull().default(0), // Total quiz time (0 = untimed)
  rewardXp: integer('reward_xp').notNull().default(100),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  startsAt: integer('starts_at', { mode: 'timestamp' }),                // Optional live contest window
  endsAt: integer('ends_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

/**
 * Quiz Questions Join Table
 * Associates reusable questions with specific quizzes and defines question sequence.
 */
export const quizQuestions = sqliteTable('quiz_questions', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  quizId: text('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  questionId: integer('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
})

/**
 * Quiz Attempts Table
 * Records player runs, scores, total time taken, and status.
 */
export const attempts = sqliteTable('attempts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: text('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'set null' }),
  guestName: text('guest_name'),
  score: integer('score').notNull().default(0),
  totalQuestions: integer('total_questions').notNull().default(0),
  totalXpAwarded: integer('total_xp_awarded').notNull().default(0),
  timeTakenSeconds: integer('time_taken_seconds').notNull().default(0),
  status: text('status', { enum: ['in_progress', 'completed', 'abandoned'] })
    .notNull()
    .default('in_progress'),
  startedAt: integer('started_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
})

/**
 * Attempt Answers Table
 * Stores granular answer logs for each question in a quiz attempt.
 */
export const attemptAnswers = sqliteTable('attempt_answers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  attemptId: text('attempt_id')
    .notNull()
    .references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: integer('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  selectedAnswer: text('selected_answer').notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  responseTimeMs: integer('response_time_ms'),
})

export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert

export type Quiz = typeof quizzes.$inferSelect
export type NewQuiz = typeof quizzes.$inferInsert

export type QuizQuestion = typeof quizQuestions.$inferSelect
export type NewQuizQuestion = typeof quizQuestions.$inferInsert

export type Attempt = typeof attempts.$inferSelect
export type NewAttempt = typeof attempts.$inferInsert

export type AttemptAnswer = typeof attemptAnswers.$inferSelect
export type NewAttemptAnswer = typeof attemptAnswers.$inferInsert

