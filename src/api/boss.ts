import { Hono } from 'hono'
import { eq, desc, count } from 'drizzle-orm'
import {
  getDb,
  user as userTable,
  quizzes as quizzesTable,
  questions as questionsTable,
  quizQuestions as quizQuestionsTable,
  tags as tagsTable,
  questionTags as questionTagsTable,
  attempts as attemptsTable,
  QUIZ_CATEGORIES,
  isValidTag,
  type QuizCategory,
} from '../db'
import { createAuth, type AuthEnv } from '../lib/auth'

export type BossEnv = {
  Bindings: AuthEnv
}

export const bossApi = new Hono<BossEnv>()

/**
 * Helper to get the authenticated user and verify boss status.
 */
async function getAuthenticatedBoss(c: any) {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return { user: null, isBoss: false }
  }

  const db = getDb(c.env)
  const [dbUser] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      isBoss: userTable.isBoss,
    })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))

  const isBoss = Boolean(dbUser?.isBoss)
  return {
    user: dbUser || session.user,
    isBoss,
  }
}

/**
 * GET /api/boss/auth-check
 * Public check for boss privileges on current session.
 */
bossApi.get('/auth-check', async (c) => {
  try {
    const { user, isBoss } = await getAuthenticatedBoss(c)
    return c.json({
      authenticated: Boolean(user),
      isBoss,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            isBoss,
          }
        : null,
    })
  } catch (err: any) {
    return c.json(
      {
        authenticated: false,
        isBoss: false,
        user: null,
        error: err?.message || 'Failed to check boss status',
      },
      500
    )
  }
})

/**
 * Middleware: Enforce boss privileges for all routes below
 */
bossApi.use('*', async (c, next) => {
  // Allow the auth-check endpoint without blocking
  if (c.req.path.endsWith('/auth-check')) {
    return next()
  }

  const { isBoss } = await getAuthenticatedBoss(c)
  if (!isBoss) {
    return c.json(
      {
        error: 'Forbidden',
        message: 'Access denied: Commander Boss privileges are required for this action.',
      },
      403
    )
  }

  return next()
})

// ==========================================
// STATS / OVERVIEW
// ==========================================

bossApi.get('/stats', async (c) => {
  const db = getDb(c.env)

  const [[quizzesTotal], [questionsTotal], [tagsTotal], [attemptsTotal], [usersTotal]] = await Promise.all([
    db.select({ value: count() }).from(quizzesTable),
    db.select({ value: count() }).from(questionsTable),
    db.select({ value: count() }).from(tagsTable),
    db.select({ value: count() }).from(attemptsTable),
    db.select({ value: count() }).from(userTable),
  ])

  const recentQuizzes = await db
    .select()
    .from(quizzesTable)
    .orderBy(desc(quizzesTable.createdAt))
    .limit(5)

  const recentQuestions = await db
    .select()
    .from(questionsTable)
    .orderBy(desc(questionsTable.createdAt))
    .limit(5)

  return c.json({
    success: true,
    stats: {
      quizzesCount: quizzesTotal?.value || 0,
      questionsCount: questionsTotal?.value || 0,
      tagsCount: tagsTotal?.value || 0,
      attemptsCount: attemptsTotal?.value || 0,
      usersCount: usersTotal?.value || 0,
    },
    recentQuizzes,
    recentQuestions,
  })
})

// ==========================================
// QUIZZES MANAGEMENT
// ==========================================

/**
 * GET /api/boss/quizzes
 * Returns all quizzes with their assigned questions count
 */
bossApi.get('/quizzes', async (c) => {
  const db = getDb(c.env)
  const allQuizzes = await db
    .select()
    .from(quizzesTable)
    .orderBy(desc(quizzesTable.createdAt))

  // Fetch question counts per quiz
  const quizQuestionsCounts = await db
    .select({
      quizId: quizQuestionsTable.quizId,
      count: count(),
    })
    .from(quizQuestionsTable)
    .groupBy(quizQuestionsTable.quizId)

  const countMap = new Map<string, number>()
  quizQuestionsCounts.forEach((row) => {
    countMap.set(row.quizId, row.count)
  })

  const quizzesWithMeta = allQuizzes.map((q) => ({
    ...q,
    questionsCount: countMap.get(q.id) || 0,
  }))

  return c.json({ success: true, quizzes: quizzesWithMeta })
})

/**
 * GET /api/boss/quizzes/:id
 * Returns quiz details with full list of ordered questions
 */
bossApi.get('/quizzes/:id', async (c) => {
  const db = getDb(c.env)
  const quizId = c.req.param('id')

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, quizId))
  if (!quiz) {
    return c.json({ error: 'Not Found', message: 'Quiz not found' }, 404)
  }

  // Get mapped questions
  const mapped = await db
    .select({
      linkId: quizQuestionsTable.id,
      orderIndex: quizQuestionsTable.orderIndex,
      question: questionsTable,
    })
    .from(quizQuestionsTable)
    .innerJoin(questionsTable, eq(quizQuestionsTable.questionId, questionsTable.id))
    .where(eq(quizQuestionsTable.quizId, quizId))
    .orderBy(quizQuestionsTable.orderIndex)

  return c.json({
    success: true,
    quiz,
    questions: mapped.map((m) => ({
      ...m.question,
      orderIndex: m.orderIndex,
    })),
  })
})

/**
 * GET /api/boss/categories
 * Returns the exhaustive list of quiz categories.
 */
bossApi.get('/categories', async (c) => {
  return c.json({ success: true, categories: QUIZ_CATEGORIES })
})

/**
 * POST /api/boss/quizzes
 * Create new quiz and optionally assign questions
 */
bossApi.post('/quizzes', async (c) => {
  const db = getDb(c.env)
  const body = await c.req.json().catch(() => ({}))

  const title = (body.title || '').trim()
  if (!title) {
    return c.json({ error: 'Validation Error', message: 'Title is required' }, 400)
  }

  const slug = (body.slug || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `quiz-${Date.now()}`

  const category = (QUIZ_CATEGORIES.includes(body.category) ? body.category : 'general') as QuizCategory

  try {
    const newQuizId = crypto.randomUUID()
    const [inserted] = await db
      .insert(quizzesTable)
      .values({
        id: newQuizId,
        title,
        slug,
        description: body.description || '',
        category,
        difficulty: body.difficulty || 'medium',
        timeLimitSeconds: Number(body.timeLimitSeconds) || 0,
        rewardXp: Number(body.rewardXp) || 100,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      })
      .returning()

    // Assign questions if provided
    if (Array.isArray(body.questionIds) && body.questionIds.length > 0) {
      const links = body.questionIds.map((qId: number, idx: number) => ({
        quizId: newQuizId,
        questionId: Number(qId),
        orderIndex: idx,
      }))
      await db.insert(quizQuestionsTable).values(links)
    }

    return c.json({ success: true, quiz: inserted }, 201)
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to create quiz' }, 500)
  }
})

/**
 * PUT /api/boss/quizzes/:id
 * Update quiz metadata and optionally sync assigned questions
 */
bossApi.put('/quizzes/:id', async (c) => {
  const db = getDb(c.env)
  const quizId = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))

  const title = (body.title || '').trim()
  if (!title) {
    return c.json({ error: 'Validation Error', message: 'Title is required' }, 400)
  }

  const slug = (body.slug || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `quiz-${Date.now()}`

  try {
    const [updated] = await db
      .update(quizzesTable)
      .set({
        title,
        slug,
        description: body.description ?? '',
        category: (QUIZ_CATEGORIES.includes(body.category) ? body.category : 'general') as QuizCategory,
        difficulty: body.difficulty ?? 'medium',
        timeLimitSeconds: !isNaN(Number(body.timeLimitSeconds)) ? Number(body.timeLimitSeconds) : 0,
        rewardXp: !isNaN(Number(body.rewardXp)) ? Number(body.rewardXp) : 100,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        updatedAt: new Date(),
      })
      .where(eq(quizzesTable.id, quizId))
      .returning()

    if (!updated) {
      return c.json({ error: 'Not Found', message: 'Quiz not found' }, 404)
    }

    // Sync questions if provided
    if (Array.isArray(body.questionIds)) {
      await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quizId))

      if (body.questionIds.length > 0) {
        const links = body.questionIds.map((qId: number, idx: number) => ({
          quizId,
          questionId: Number(qId),
          orderIndex: idx,
        }))
        await db.insert(quizQuestionsTable).values(links)
      }
    }

    return c.json({ success: true, quiz: updated })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to update quiz' }, 500)
  }
})

/**
 * DELETE /api/boss/quizzes/:id
 * Delete quiz
 */
bossApi.delete('/quizzes/:id', async (c) => {
  const db = getDb(c.env)
  const quizId = c.req.param('id')

  try {
    await db.delete(quizzesTable).where(eq(quizzesTable.id, quizId))
    return c.json({ success: true, message: 'Quiz deleted successfully' })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to delete quiz' }, 500)
  }
})

// ==========================================
// QUESTIONS MANAGEMENT
// ==========================================

/**
 * GET /api/boss/questions
 * Returns all questions with their assigned tags
 */
bossApi.get('/questions', async (c) => {
  const db = getDb(c.env)
  const search = (c.req.query('search') || '').trim().toLowerCase()
  const difficulty = c.req.query('difficulty')
  const tagId = c.req.query('tagId') ? Number(c.req.query('tagId')) : null

  const allQuestions = await db
    .select()
    .from(questionsTable)
    .orderBy(desc(questionsTable.createdAt))


  // Fetch all question-tag links
  const questionTagRows = await db
    .select({
      questionId: questionTagsTable.questionId,
      tag: tagsTable,
    })
    .from(questionTagsTable)
    .innerJoin(tagsTable, eq(questionTagsTable.tagId, tagsTable.id))

  const tagsByQuestionId = new Map<number, any[]>()
  questionTagRows.forEach(({ questionId, tag }) => {
    const list = tagsByQuestionId.get(questionId) || []
    list.push(tag)
    tagsByQuestionId.set(questionId, list)
  })

  let questionsWithTags = allQuestions.map((q) => ({
    ...q,
    tags: tagsByQuestionId.get(q.id) || [],
  }))

  if (search) {
    questionsWithTags = questionsWithTags.filter(
      (q) =>
        q.questionText.toLowerCase().includes(search) ||
        q.tags.some((t: any) => t.name.toLowerCase().includes(search))
    )
  }

  if (difficulty && difficulty !== 'all') {
    questionsWithTags = questionsWithTags.filter((q) => q.difficulty === difficulty)
  }

  if (tagId) {
    questionsWithTags = questionsWithTags.filter((q) =>
      q.tags.some((t: any) => t.id === tagId)
    )
  }

  return c.json({ success: true, questions: questionsWithTags })
})

/**
 * GET /api/boss/questions/:id
 * Returns single question with assigned tags
 */
bossApi.get('/questions/:id', async (c) => {
  const db = getDb(c.env)
  const qId = Number(c.req.param('id'))
  if (isNaN(qId)) {
    return c.json({ error: 'Bad Request', message: 'Invalid question ID' }, 400)
  }

  const [question] = await db.select().from(questionsTable).where(eq(questionsTable.id, qId))
  if (!question) {
    return c.json({ error: 'Not Found', message: 'Question not found' }, 404)
  }

  const tagRows = await db
    .select({ tag: tagsTable })
    .from(questionTagsTable)
    .innerJoin(tagsTable, eq(questionTagsTable.tagId, tagsTable.id))
    .where(eq(questionTagsTable.questionId, qId))

  return c.json({
    success: true,
    question: {
      ...question,
      tags: tagRows.map((r) => r.tag),
    },
  })
})

/**
 * POST /api/boss/questions
 * Create new question and assign tags
 */
bossApi.post('/questions', async (c) => {
  const db = getDb(c.env)
  const body = await c.req.json().catch(() => ({}))

  const questionText = (body.questionText || '').trim()
  const options = Array.isArray(body.options)
    ? body.options.map((o: any) => String(o).trim()).filter(Boolean)
    : []
  const correctAnswer = (body.correctAnswer || '').trim()

  if (!questionText) {
    return c.json({ error: 'Validation Error', message: 'Question text is required' }, 400)
  }
  if (options.length < 2) {
    return c.json({ error: 'Validation Error', message: 'At least 2 options are required' }, 400)
  }
  if (!correctAnswer || !options.includes(correctAnswer)) {
    return c.json({ error: 'Validation Error', message: 'Valid correct answer from options is required' }, 400)
  }

  try {
    const [newQuestion] = await db
      .insert(questionsTable)
      .values({
        questionText,
        options,
        correctAnswer,
        explanation: body.explanation || '',
        difficulty: body.difficulty || 'medium',
      })
      .returning()

    // Attach tags if provided
    if (Array.isArray(body.tagIds) && body.tagIds.length > 0) {
      const tagLinks = body.tagIds.map((tId: number) => ({
        questionId: newQuestion.id,
        tagId: Number(tId),
      }))
      await db.insert(questionTagsTable).values(tagLinks)
    }

    return c.json({ success: true, question: newQuestion }, 201)
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to create question' }, 500)
  }
})

/**
 * PUT /api/boss/questions/:id
 * Update question and sync tags
 */
bossApi.put('/questions/:id', async (c) => {
  const db = getDb(c.env)
  const qId = Number(c.req.param('id'))
  if (isNaN(qId)) {
    return c.json({ error: 'Bad Request', message: 'Invalid question ID' }, 400)
  }

  const body = await c.req.json().catch(() => ({}))
  const questionText = (body.questionText || '').trim()
  const options = Array.isArray(body.options)
    ? body.options.map((o: any) => String(o).trim()).filter(Boolean)
    : []
  const correctAnswer = (body.correctAnswer || '').trim()

  if (!questionText) {
    return c.json({ error: 'Validation Error', message: 'Question text is required' }, 400)
  }
  if (options.length < 2) {
    return c.json({ error: 'Validation Error', message: 'At least 2 options are required' }, 400)
  }
  if (!correctAnswer || !options.includes(correctAnswer)) {
    return c.json({ error: 'Validation Error', message: 'Valid correct answer from options is required' }, 400)
  }

  try {
    const [updated] = await db
      .update(questionsTable)
      .set({
        questionText,
        options,
        correctAnswer,
        explanation: body.explanation ?? '',
        difficulty: body.difficulty ?? 'medium',
        updatedAt: new Date(),
      })
      .where(eq(questionsTable.id, qId))
      .returning()

    if (!updated) {
      return c.json({ error: 'Not Found', message: 'Question not found' }, 404)
    }

    // Sync tags if tagIds is passed
    if (Array.isArray(body.tagIds)) {
      await db.delete(questionTagsTable).where(eq(questionTagsTable.questionId, qId))
      if (body.tagIds.length > 0) {
        const tagLinks = body.tagIds.map((tId: number) => ({
          questionId: qId,
          tagId: Number(tId),
        }))
        await db.insert(questionTagsTable).values(tagLinks)
      }
    }

    return c.json({ success: true, question: updated })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to update question' }, 500)
  }
})

/**
 * DELETE /api/boss/questions/:id
 * Delete question
 */
bossApi.delete('/questions/:id', async (c) => {
  const db = getDb(c.env)
  const qId = Number(c.req.param('id'))
  if (isNaN(qId)) {
    return c.json({ error: 'Bad Request', message: 'Invalid question ID' }, 400)
  }

  try {
    await db.delete(questionsTable).where(eq(questionsTable.id, qId))
    return c.json({ success: true, message: 'Question deleted successfully' })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to delete question' }, 500)
  }
})

// ==========================================
// TAGS MANAGEMENT
// ==========================================

/**
 * GET /api/boss/tags
 * Returns all tags with question counts
 */
bossApi.get('/tags', async (c) => {
  const db = getDb(c.env)
  const allTags = await db.select().from(tagsTable).orderBy(tagsTable.name)

  const counts = await db
    .select({
      tagId: questionTagsTable.tagId,
      count: count(),
    })
    .from(questionTagsTable)
    .groupBy(questionTagsTable.tagId)

  const countMap = new Map<number, number>()
  counts.forEach((row) => {
    countMap.set(row.tagId, row.count)
  })

  const tagsWithCounts = allTags.map((t) => ({
    ...t,
    questionsCount: countMap.get(t.id) || 0,
  }))

  return c.json({ success: true, tags: tagsWithCounts })
})

/**
 * POST /api/boss/tags
 * Create new tag
 */
bossApi.post('/tags', async (c) => {
  const db = getDb(c.env)
  const body = await c.req.json().catch(() => ({}))

  const rawName = (body.name || '').trim().toLowerCase()
  if (!rawName) {
    return c.json({ error: 'Validation Error', message: 'Tag name is required' }, 400)
  }
  if (!isValidTag(rawName)) {
    return c.json(
      {
        error: 'Validation Error',
        message: 'Tags must contain only lowercase alphabetical letters (a-z) with no spaces, numbers, or special characters.',
      },
      400
    )
  }

  const name = rawName
  const slug = rawName

  const color = body.color || 'teal'
  const description = body.description || ''

  try {
    const [tag] = await db
      .insert(tagsTable)
      .values({
        name,
        slug,
        description,
        color,
      })
      .returning()

    return c.json({ success: true, tag }, 201)
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to create tag' }, 500)
  }
})

/**
 * PUT /api/boss/tags/:id
 * Update tag
 */
bossApi.put('/tags/:id', async (c) => {
  const db = getDb(c.env)
  const tagId = Number(c.req.param('id'))
  if (isNaN(tagId)) {
    return c.json({ error: 'Bad Request', message: 'Invalid tag ID' }, 400)
  }

  const body = await c.req.json().catch(() => ({}))
  const rawName = (body.name || '').trim().toLowerCase()
  if (!rawName) {
    return c.json({ error: 'Validation Error', message: 'Tag name is required' }, 400)
  }
  if (!isValidTag(rawName)) {
    return c.json(
      {
        error: 'Validation Error',
        message: 'Tags must contain only lowercase alphabetical letters (a-z) with no spaces, numbers, or special characters.',
      },
      400
    )
  }

  const name = rawName
  const slug = rawName

  try {
    const [updated] = await db
      .update(tagsTable)
      .set({
        name,
        slug,
        description: body.description ?? '',
        color: body.color ?? 'teal',
        updatedAt: new Date(),
      })
      .where(eq(tagsTable.id, tagId))
      .returning()

    if (!updated) {
      return c.json({ error: 'Not Found', message: 'Tag not found' }, 404)
    }

    return c.json({ success: true, tag: updated })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to update tag' }, 500)
  }
})

/**
 * DELETE /api/boss/tags/:id
 * Delete tag
 */
bossApi.delete('/tags/:id', async (c) => {
  const db = getDb(c.env)
  const tagId = Number(c.req.param('id'))
  if (isNaN(tagId)) {
    return c.json({ error: 'Bad Request', message: 'Invalid tag ID' }, 400)
  }

  try {
    await db.delete(tagsTable).where(eq(tagsTable.id, tagId))
    return c.json({ success: true, message: 'Tag deleted successfully' })
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Failed to delete tag' }, 500)
  }
})
