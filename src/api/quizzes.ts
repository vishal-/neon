import { Hono } from 'hono'
import { eq, and, desc } from 'drizzle-orm'
import {
  getDb,
  quizzes as quizzesTable,
  questions as questionsTable,
  quizQuestions as quizQuestionsTable,
  attempts as attemptsTable,
  attemptAnswers as attemptAnswersTable,
} from '../db'
import { createAuth, type AuthEnv } from '../lib/auth'
import { awardXp } from '../lib/xp'

export type QuizzesApiEnv = {
  Bindings: AuthEnv
}

export const quizzesApi = new Hono<QuizzesApiEnv>()

/**
 * Utility: In-place Fisher-Yates array shuffle.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * GET /api/quizzes/latest
 * Fetch the latest published active quiz.
 */
quizzesApi.get('/latest', async (c) => {
  const db = getDb(c.env)
  const [latestQuiz] = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.isActive, true))
    .orderBy(desc(quizzesTable.createdAt))
    .limit(1)

  if (!latestQuiz) {
    return c.json({ success: false, quiz: null })
  }

  // Count questions
  const mapped = await db
    .select({ questionId: quizQuestionsTable.questionId })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, latestQuiz.id))

  return c.json({
    success: true,
    quiz: {
      id: latestQuiz.id,
      title: latestQuiz.title,
      slug: latestQuiz.slug,
      description: latestQuiz.description,
      category: latestQuiz.category,
      difficulty: latestQuiz.difficulty,
      timeLimitSeconds: latestQuiz.timeLimitSeconds,
      rewardXp: latestQuiz.rewardXp,
      questionCount: mapped.length,
      createdAt: latestQuiz.createdAt,
    },
  })
})

/**
 * GET /api/quizzes
 * Fetch all published active quizzes with filtering options.
 */
quizzesApi.get('/', async (c) => {
  const db = getDb(c.env)
  const category = c.req.query('category')
  const difficulty = c.req.query('difficulty')
  const search = c.req.query('search')?.toLowerCase().trim()

  const allActive = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.isActive, true))
    .orderBy(desc(quizzesTable.createdAt))

  // Fetch all quiz-question counts
  const allLinks = await db
    .select({
      quizId: quizQuestionsTable.quizId,
    })
    .from(quizQuestionsTable)

  const countMap = new Map<string, number>()
  for (const link of allLinks) {
    countMap.set(link.quizId, (countMap.get(link.quizId) || 0) + 1)
  }

  let filtered = allActive.map((q) => ({
    id: q.id,
    title: q.title,
    slug: q.slug,
    description: q.description,
    category: q.category,
    difficulty: q.difficulty,
    timeLimitSeconds: q.timeLimitSeconds,
    rewardXp: q.rewardXp,
    questionCount: countMap.get(q.id) || 0,
    createdAt: q.createdAt,
  }))

  if (category && category !== 'all') {
    filtered = filtered.filter((q) => q.category === category)
  }

  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter((q) => q.difficulty === difficulty)
  }

  if (search) {
    filtered = filtered.filter(
      (q) =>
        q.title.toLowerCase().includes(search) ||
        (q.description && q.description.toLowerCase().includes(search)) ||
        q.category.toLowerCase().includes(search)
    )
  }

  return c.json({
    success: true,
    quizzes: filtered,
    total: filtered.length,
  })
})

/**
 * GET /api/quizzes/:slug/briefing
 * Public briefing info before starting the quiz.
 */
quizzesApi.get('/:slug/briefing', async (c) => {
  const db = getDb(c.env)
  const slug = c.req.param('slug')

  const [quiz] = await db
    .select()
    .from(quizzesTable)
    .where(and(eq(quizzesTable.slug, slug), eq(quizzesTable.isActive, true)))

  if (!quiz) {
    return c.json({ error: 'Not Found', message: 'Quiz mission not found or inactive' }, 404)
  }

  // Count total questions mapped to this quiz
  const mappedQuestions = await db
    .select({ questionId: quizQuestionsTable.questionId })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quiz.id))

  const totalQuestions = mappedQuestions.length

  // Check user session
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  let activeAttempt: { id: string; expiresAt: Date | null } | null = null
  let latestCompleted: { score: number; totalQuestions: number; completedAt: Date | null } | null = null

  if (session?.user?.id) {
    // Check for active in-progress attempt
    const [inProgress] = await db
      .select()
      .from(attemptsTable)
      .where(
        and(
          eq(attemptsTable.quizId, quiz.id),
          eq(attemptsTable.userId, session.user.id),
          eq(attemptsTable.status, 'in_progress')
        )
      )
      .orderBy(desc(attemptsTable.startedAt))
      .limit(1)

    if (inProgress) {
      const isExpired = inProgress.expiresAt && inProgress.expiresAt.getTime() < Date.now()
      if (!isExpired) {
        activeAttempt = {
          id: inProgress.id,
          expiresAt: inProgress.expiresAt,
        }
      }
    }

    // Check latest completed attempt
    const [completed] = await db
      .select()
      .from(attemptsTable)
      .where(
        and(
          eq(attemptsTable.quizId, quiz.id),
          eq(attemptsTable.userId, session.user.id),
          eq(attemptsTable.status, 'completed')
        )
      )
      .orderBy(desc(attemptsTable.completedAt))
      .limit(1)

    if (completed) {
      latestCompleted = {
        score: completed.score,
        totalQuestions: completed.totalQuestions,
        completedAt: completed.completedAt,
      }
    }
  }

  return c.json({
    success: true,
    quiz: {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimitSeconds: quiz.timeLimitSeconds,
      rewardXp: quiz.rewardXp,
    },
    totalQuestions,
    activeAttempt,
    latestCompleted,
    authenticated: !!session?.user,
  })
})

/**
 * POST /api/quizzes/:slug/start
 * Starts a new quiz attempt or resumes an ongoing one.
 * Logs server-side start time and returns questions with randomized question & option sequences.
 */
quizzesApi.post('/:slug/start', async (c) => {
  const db = getDb(c.env)
  const slug = c.req.param('slug')

  const [quiz] = await db
    .select()
    .from(quizzesTable)
    .where(and(eq(quizzesTable.slug, slug), eq(quizzesTable.isActive, true)))

  if (!quiz) {
    return c.json({ error: 'Not Found', message: 'Quiz mission not found or inactive' }, 404)
  }

  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  const userId = session?.user?.id || null

  // Check for active attempt to resume if signed in
  if (userId) {
    const [active] = await db
      .select()
      .from(attemptsTable)
      .where(
        and(
          eq(attemptsTable.quizId, quiz.id),
          eq(attemptsTable.userId, userId),
          eq(attemptsTable.status, 'in_progress')
        )
      )
      .orderBy(desc(attemptsTable.startedAt))
      .limit(1)

    if (active && (!active.expiresAt || active.expiresAt.getTime() > Date.now())) {
      // Reconstruct questions in persistent shuffled order
      const rawQuestions = await db
        .select({
          id: questionsTable.id,
          questionText: questionsTable.questionText,
          options: questionsTable.options,
        })
        .from(questionsTable)

      const questionMap = new Map(rawQuestions.map((q) => [q.id, q]))
      const shuffledOrder = active.shuffledOrder || []

      const orderedQuestions = shuffledOrder
        .map((item) => {
          const q = questionMap.get(item.questionId)
          if (!q) return null
          return {
            id: q.id,
            questionText: q.questionText,
            options: item.options,
          }
        })
        .filter(Boolean)

      // Fetch saved answers
      const savedAnswersList = await db
        .select()
        .from(attemptAnswersTable)
        .where(eq(attemptAnswersTable.attemptId, active.id))

      const savedAnswers: Record<number, string> = {}
      for (const ans of savedAnswersList) {
        savedAnswers[ans.questionId] = ans.selectedAnswer
      }

      return c.json({
        success: true,
        resumed: true,
        attemptId: active.id,
        quizTitle: quiz.title,
        startedAt: active.startedAt,
        expiresAt: active.expiresAt,
        timeLimitSeconds: quiz.timeLimitSeconds,
        serverTime: Date.now(),
        questions: orderedQuestions,
        savedAnswers,
      })
    }
  }

  // Fetch all assigned questions from the question bank
  const mapped = await db
    .select({
      id: questionsTable.id,
      questionText: questionsTable.questionText,
      options: questionsTable.options,
    })
    .from(quizQuestionsTable)
    .innerJoin(questionsTable, eq(quizQuestionsTable.questionId, questionsTable.id))
    .where(eq(quizQuestionsTable.quizId, quiz.id))

  if (!mapped.length) {
    return c.json({ error: 'Bad Request', message: 'This quiz has no questions assigned yet.' }, 400)
  }

  // 1. Shuffle question order (Fisher-Yates)
  const shuffledQuestions = shuffleArray(mapped)

  // 2. Shuffle options for each question (Fisher-Yates) and prepare persistent order
  const shuffledOrder: { questionId: number; options: string[] }[] = []
  const clientQuestions = shuffledQuestions.map((q) => {
    const rawOptions: string[] = Array.isArray(q.options)
      ? (q.options as string[])
      : (JSON.parse(String(q.options || '[]')) as string[])
    const shuffledOptions: string[] = shuffleArray(rawOptions)
    shuffledOrder.push({
      questionId: q.id,
      options: shuffledOptions,
    })
    return {
      id: q.id,
      questionText: q.questionText,
      options: shuffledOptions,
    }
  })

  const now = new Date()
  const expiresAt =
    quiz.timeLimitSeconds > 0
      ? new Date(now.getTime() + quiz.timeLimitSeconds * 1000)
      : null

  const attemptId = crypto.randomUUID()

  await db.insert(attemptsTable).values({
    id: attemptId,
    quizId: quiz.id,
    userId,
    guestName: userId ? null : 'Cadet Explorer',
    totalQuestions: clientQuestions.length,
    status: 'in_progress',
    startedAt: now,
    expiresAt,
    shuffledOrder,
  })

  return c.json({
    success: true,
    resumed: false,
    attemptId,
    quizTitle: quiz.title,
    startedAt: now,
    expiresAt,
    timeLimitSeconds: quiz.timeLimitSeconds,
    serverTime: Date.now(),
    questions: clientQuestions,
    savedAnswers: {},
  })
})

/**
 * POST /api/quizzes/attempts/:attemptId/answer
 * Captures an answer for a question in real-time.
 * Strictly verifies server-side expiration and upserts latest answer.
 */
quizzesApi.post('/attempts/:attemptId/answer', async (c) => {
  const db = getDb(c.env)
  const attemptId = c.req.param('attemptId')
  const body = await c.req.json().catch(() => ({}))

  const { questionId, selectedAnswer } = body

  if (typeof questionId !== 'number' || typeof selectedAnswer !== 'string') {
    return c.json({ error: 'Validation Error', message: 'questionId and selectedAnswer required' }, 400)
  }

  const [attempt] = await db
    .select()
    .from(attemptsTable)
    .where(eq(attemptsTable.id, attemptId))

  if (!attempt) {
    return c.json({ error: 'Not Found', message: 'Attempt session not found' }, 404)
  }

  if (attempt.status !== 'in_progress') {
    return c.json({ error: 'Forbidden', message: 'This attempt has already concluded' }, 403)
  }

  // Server-side Anti-Cheat: verify deadline + 5s latency grace period
  if (attempt.expiresAt && Date.now() > attempt.expiresAt.getTime() + 5000) {
    return c.json(
      {
        error: 'Time Expired',
        message: 'The mission time limit has expired. Please submit for evaluation.',
        expired: true,
      },
      400
    )
  }

  // Upsert latest answer into attempt_answers
  const [existingAnswer] = await db
    .select()
    .from(attemptAnswersTable)
    .where(
      and(
        eq(attemptAnswersTable.attemptId, attemptId),
        eq(attemptAnswersTable.questionId, questionId)
      )
    )

  if (existingAnswer) {
    await db
      .update(attemptAnswersTable)
      .set({
        selectedAnswer: selectedAnswer.trim(),
        updatedAt: new Date(),
      })
      .where(eq(attemptAnswersTable.id, existingAnswer.id))
  } else {
    await db.insert(attemptAnswersTable).values({
      attemptId,
      questionId,
      selectedAnswer: selectedAnswer.trim(),
      isCorrect: null,
    })
  }

  return c.json({
    success: true,
    saved: true,
    questionId,
    selectedAnswer: selectedAnswer.trim(),
  })
})

/**
 * POST /api/quizzes/attempts/:attemptId/submit
 * Concludes the quiz attempt, evaluates all answers on the backend,
 * updates the attempt record, awards XP via the ledger, and returns the debrief.
 */
quizzesApi.post('/attempts/:attemptId/submit', async (c) => {
  const db = getDb(c.env)
  const attemptId = c.req.param('attemptId')

  const [attempt] = await db
    .select()
    .from(attemptsTable)
    .where(eq(attemptsTable.id, attemptId))

  if (!attempt) {
    return c.json({ error: 'Not Found', message: 'Attempt session not found' }, 404)
  }

  const [quiz] = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, attempt.quizId))

  if (!quiz) {
    return c.json({ error: 'Not Found', message: 'Quiz not found' }, 404)
  }

  // Fetch true correct answers and explanations for this quiz
  const questionsList = await db
    .select({
      id: questionsTable.id,
      questionText: questionsTable.questionText,
      options: questionsTable.options,
      correctAnswer: questionsTable.correctAnswer,
      explanation: questionsTable.explanation,
    })
    .from(quizQuestionsTable)
    .innerJoin(questionsTable, eq(quizQuestionsTable.questionId, questionsTable.id))
    .where(eq(quizQuestionsTable.quizId, quiz.id))

  const questionMap = new Map(questionsList.map((q) => [q.id, q]))

  // Fetch all saved answers
  const savedAnswersList = await db
    .select()
    .from(attemptAnswersTable)
    .where(eq(attemptAnswersTable.attemptId, attemptId))

  const answerMap = new Map(savedAnswersList.map((a) => [a.questionId, a]))

  // Evaluate answers
  let score = 0
  const reviewItems = []

  const questionsOrder = attempt.shuffledOrder || questionsList.map((q) => ({ questionId: q.id, options: q.options }))

  for (const item of questionsOrder) {
    const q = questionMap.get(item.questionId)
    if (!q) continue

    const ansRecord = answerMap.get(q.id)
    const cadetAnswer = ansRecord ? ansRecord.selectedAnswer.trim() : ''
    const correctAnswer = q.correctAnswer.trim()
    const isCorrect = cadetAnswer.length > 0 && cadetAnswer.toLowerCase() === correctAnswer.toLowerCase()

    if (isCorrect) score++

    // Update isCorrect in attemptAnswers
    if (ansRecord) {
      await db
        .update(attemptAnswersTable)
        .set({ isCorrect })
        .where(eq(attemptAnswersTable.id, ansRecord.id))
    }

    reviewItems.push({
      questionId: q.id,
      questionText: q.questionText,
      options: item.options,
      cadetAnswer: cadetAnswer || '(Unanswered)',
      correctAnswer,
      isCorrect,
      explanation: q.explanation || null,
    })
  }

  const totalQuestions = questionsList.length
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const completedAt = new Date()
  const timeTakenSeconds = Math.max(
    1,
    Math.round((completedAt.getTime() - attempt.startedAt.getTime()) / 1000)
  )

  const totalXpAwarded =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * quiz.rewardXp) : 0

  // Update attempt status
  await db
    .update(attemptsTable)
    .set({
      score,
      totalQuestions,
      totalXpAwarded,
      timeTakenSeconds,
      status: 'completed',
      completedAt,
    })
    .where(eq(attemptsTable.id, attemptId))

  // Award XP via the universal XP ledger
  let xpResult = null
  if (attempt.userId && totalXpAwarded > 0) {
    try {
      xpResult = await awardXp(db, {
        userId: attempt.userId,
        amount: totalXpAwarded,
        activityType: 'quiz',
        activityId: quiz.id,
        description: `Completed Quiz: ${quiz.title}`,
        metadata: {
          score,
          totalQuestions,
          percentage,
          timeTakenSeconds,
          attemptId,
        },
      })
    } catch (err) {
      console.error('Failed to award XP for quiz attempt:', err)
    }
  }

  return c.json({
    success: true,
    quizTitle: quiz.title,
    score,
    totalQuestions,
    percentage,
    totalXpAwarded,
    timeTakenSeconds,
    xpResult: xpResult
      ? {
          totalXp: xpResult.totalXp,
          level: xpResult.level,
        }
      : null,
    review: reviewItems,
  })
})
