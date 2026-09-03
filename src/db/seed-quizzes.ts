import { createClient } from '@libsql/client/web'
import fs from 'fs'

export const SPACE_TRIVIA_DATA = {
  quiz: {
    id: 'space-trivia',
    title: 'Space Trivia',
    slug: 'space-trivia',
    description: 'Test your knowledge of planets, stars, galaxies, and the amazing universe',
    category: 'science',
    difficulty: 'medium',
    timeLimitSeconds: 300,
    rewardXp: 150,
    isActive: true,
  },
  questions: [
    {
      question_text: 'Which planet is known as the red planet?',
      options: ['venus', 'mars', 'jupiter', 'mercury'],
      correct_answer: 'mars',
      explanation: 'Mars appears reddish because its surface contains iron minerals that have oxidized, or rusted.',
    },
    {
      question_text: 'What is the largest planet in our solar system?',
      options: ['saturn', 'earth', 'jupiter', 'neptune'],
      correct_answer: 'jupiter',
      explanation: 'Jupiter is the largest planet in our solar system, with a diameter more than eleven times that of Earth.',
    },
    {
      question_text: 'What is the name of the galaxy that contains our solar system?',
      options: ['andromeda galaxy', 'milky way', 'whirlpool galaxy', 'sombrero galaxy'],
      correct_answer: 'milky way',
      explanation: 'Our solar system is located in the Milky Way, a large spiral galaxy containing billions of stars.',
    },
    {
      question_text: 'Which planet is closest to the sun?',
      options: ['venus', 'earth', 'mercury', 'mars'],
      correct_answer: 'mercury',
      explanation: 'Mercury is the innermost planet in our solar system and takes only about 88 Earth days to orbit the Sun.',
    },
    {
      question_text: "What is the name of earth's natural satellite?",
      options: ['titan', 'moon', 'europa', 'phobos'],
      correct_answer: 'moon',
      explanation: "The Moon is Earth's only natural satellite and is the fifth largest moon in the solar system.",
    },
    {
      question_text: 'Which planet is famous for its prominent ring system?',
      options: ['mars', 'saturn', 'uranus', 'venus'],
      correct_answer: 'saturn',
      explanation: 'Saturn has the most spectacular ring system in the solar system, made mostly of ice and rocky particles.',
    },
    {
      question_text: 'What force keeps planets in orbit around the sun?',
      options: ['magnetism', 'friction', 'gravity', 'electricity'],
      correct_answer: 'gravity',
      explanation: "The Sun's enormous gravitational pull keeps the planets moving in their orbits around it.",
    },
    {
      question_text: 'Which star is at the center of our solar system?',
      options: ['polaris', 'sirius', 'the sun', 'betelgeuse'],
      correct_answer: 'the sun',
      explanation: 'The Sun is the star at the center of our solar system and provides the energy that supports life on Earth.',
    },
    {
      question_text: 'Which planet is known for having the great red spot?',
      options: ['jupiter', 'saturn', 'neptune', 'mars'],
      correct_answer: 'jupiter',
      explanation: 'The Great Red Spot is a gigantic storm on Jupiter that has been observed for hundreds of years.',
    },
    {
      question_text: 'How many planets are officially recognized in our solar system?',
      options: ['seven', 'eight', 'nine', 'ten'],
      correct_answer: 'eight',
      explanation: 'Our solar system has eight recognized planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
    },
    {
      question_text: 'Which planet is known as the hottest planet in our solar system?',
      options: ['mercury', 'venus', 'mars', 'jupiter'],
      correct_answer: 'venus',
      explanation: 'Venus is the hottest planet because its thick carbon dioxide atmosphere creates an extreme greenhouse effect.',
    },
    {
      question_text: 'What is a group of stars, gas, and dust held together by gravity called?',
      options: ['asteroid', 'galaxy', 'comet', 'meteor'],
      correct_answer: 'galaxy',
      explanation: 'A galaxy is a huge collection of stars, gas, dust, and other matter bound together by gravity.',
    },
    {
      question_text: 'Which planet rotates on its side?',
      options: ['uranus', 'neptune', 'saturn', 'mars'],
      correct_answer: 'uranus',
      explanation: 'Uranus has an extreme axial tilt of about 98 degrees, making it appear to rotate almost on its side.',
    },
    {
      question_text: "What is the name given to a rocky object that enters earth's atmosphere and burns up?",
      options: ['asteroid', 'meteor', 'comet', 'planet'],
      correct_answer: 'meteor',
      explanation: 'A meteor is the streak of light produced when a meteoroid enters Earth atmosphere and heats up.',
    },
    {
      question_text: 'Which planet is the farthest from the sun among the eight planets?',
      options: ['uranus', 'saturn', 'neptune', 'jupiter'],
      correct_answer: 'neptune',
      explanation: 'Neptune is the eighth and farthest recognized planet from the Sun in our solar system.',
    },
  ],
}

export async function seedSpaceTriviaQuiz() {
  let url = process.env.TURSO_DATABASE_URL
  let authToken = process.env.TURSO_AUTH_TOKEN

  if (fs.existsSync('.dev.vars')) {
    const content = fs.readFileSync('.dev.vars', 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        let val = trimmed.slice(idx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (key === 'TURSO_DATABASE_URL') url = val
        if (key === 'TURSO_AUTH_TOKEN') authToken = val
      }
    }
  }

  if (!url) {
    console.error('TURSO_DATABASE_URL not configured.')
    process.exit(1)
  }

  const client = createClient({ url, authToken })
  const now = Math.floor(Date.now() / 1000)

  console.log('🚀 Seeding Space Trivia Quiz...')

  // 1. Fetch relevant tag IDs for mapping (space, astronomy, science)
  const tagRows = await client.execute({
    sql: `SELECT id, name FROM tags WHERE name IN ('space', 'astronomy', 'science');`,
  })
  const tagIds = tagRows.rows.map((r: any) => Number(r.id))

  // 2. Insert or update the quiz
  const qData = SPACE_TRIVIA_DATA.quiz
  await client.execute({
    sql: `
      INSERT INTO quizzes (
        id, title, slug, description, category, difficulty,
        time_limit_seconds, reward_xp, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        category = excluded.category,
        difficulty = excluded.difficulty,
        time_limit_seconds = excluded.time_limit_seconds,
        reward_xp = excluded.reward_xp,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
    `,
    args: [
      qData.id,
      qData.title,
      qData.slug,
      qData.description,
      qData.category,
      qData.difficulty,
      qData.timeLimitSeconds,
      qData.rewardXp,
      qData.isActive ? 1 : 0,
      now,
      now,
    ],
  })

  console.log(`✓ Quiz "${qData.title}" created/updated.`)

  // 3. Insert questions and link them to the quiz and tags
  let questionCount = 0

  for (let i = 0; i < SPACE_TRIVIA_DATA.questions.length; i++) {
    const q = SPACE_TRIVIA_DATA.questions[i]
    const optionsJson = JSON.stringify(q.options)

    // Check if question already exists by question_text
    const existing = await client.execute({
      sql: `SELECT id FROM questions WHERE question_text = ? LIMIT 1;`,
      args: [q.question_text],
    })

    let questionId: number

    if (existing.rows.length > 0) {
      questionId = Number(existing.rows[0].id)
      // Update options and correct answer
      await client.execute({
        sql: `UPDATE questions SET options = ?, correct_answer = ?, explanation = ?, updated_at = ? WHERE id = ?;`,
        args: [optionsJson, q.correct_answer, q.explanation, now, questionId],
      })
    } else {
      const inserted = await client.execute({
        sql: `INSERT INTO questions (question_text, options, correct_answer, explanation, difficulty, created_at, updated_at) VALUES (?, ?, ?, ?, 'medium', ?, ?);`,
        args: [q.question_text, optionsJson, q.correct_answer, q.explanation, now, now],
      })
      questionId = Number(inserted.lastInsertRowid)
    }

    // 4. Map question to quiz in quiz_questions
    const existingLink = await client.execute({
      sql: `SELECT id FROM quiz_questions WHERE quiz_id = ? AND question_id = ? LIMIT 1;`,
      args: [qData.id, questionId],
    })

    if (existingLink.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO quiz_questions (quiz_id, question_id, order_index) VALUES (?, ?, ?);`,
        args: [qData.id, questionId, i],
      })
    } else {
      await client.execute({
        sql: `UPDATE quiz_questions SET order_index = ? WHERE quiz_id = ? AND question_id = ?;`,
        args: [i, qData.id, questionId],
      })
    }

    // 5. Attach tags to question
    for (const tId of tagIds) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO question_tags (question_id, tag_id, created_at) VALUES (?, ?, ?);`,
        args: [questionId, tId, now],
      })
    }

    questionCount++
  }

  console.log(`🎉 Space Trivia Quiz seeded with ${questionCount} questions and mapped tags!`)
}

if (
  process.argv[1]?.endsWith('seed-quizzes.ts') ||
  process.argv[1]?.endsWith('seed-quizzes.js') ||
  process.argv[1]?.endsWith('seed-quizzes.mjs')
) {
  seedSpaceTriviaQuiz().catch((err) => {
    console.error('Fatal error seeding space trivia quiz:', err)
    process.exit(1)
  })
}
