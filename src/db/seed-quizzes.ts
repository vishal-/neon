import { createClient, type Client } from '@libsql/client/web'
import fs from 'fs'

export interface QuizSeedData {
  quiz: {
    id: string
    title: string
    slug: string
    description: string
    category: string
    difficulty: string
    timeLimitSeconds: number
    rewardXp: number
    isActive: boolean
  }
  tagNames: string[]
  questions: Array<{
    question_text: string
    options: string[]
    correct_answer: string
    explanation: string
  }>
}

export const SPACE_TRIVIA_DATA: QuizSeedData = {
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
  tagNames: ['space', 'astronomy', 'science'],
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

export const INDIAN_FREEDOM_STRUGGLE_DATA: QuizSeedData = {
  quiz: {
    id: 'indian-freedom-struggle',
    title: 'Indian Freedom Struggle',
    slug: 'indian-freedom-struggle',
    description: "Test your knowledge of the major events, movements, leaders, and milestones of India's struggle for independence",
    category: 'history',
    difficulty: 'medium',
    timeLimitSeconds: 300,
    rewardXp: 150,
    isActive: true,
  },
  tagNames: ['history', 'indianhistory', 'india', 'worldhistory'],
  questions: [
    {
      question_text: 'In which year did the Indian Rebellion of 1857 begin?',
      options: ['1757', '1857', '1885', '1905'],
      correct_answer: '1857',
      explanation: 'The Indian Rebellion of 1857 began in May 1857 and became a major uprising against British rule in India.',
    },
    {
      question_text: 'Who is widely known as the father of the nation in India?',
      options: [
        'jawaharlal nehru',
        'sardar vallabhbhai patel',
        'mahatma gandhi',
        'subhas chandra bose',
      ],
      correct_answer: 'mahatma gandhi',
      explanation: 'Mahatma Gandhi became one of the most influential leaders of India struggle for independence through his philosophy of nonviolence and civil disobedience.',
    },
    {
      question_text: 'Who founded the Indian National Congress along with other leaders in 1885?',
      options: [
        'allan octavian hume',
        'bal gangadhar tilak',
        'dadabhai naoroji',
        'gopal krishna gokhale',
      ],
      correct_answer: 'allan octavian hume',
      explanation: 'Allan Octavian Hume, a retired British civil servant, played a leading role in establishing the Indian National Congress in 1885.',
    },
    {
      question_text: 'Which movement was launched by Mahatma Gandhi in 1920?',
      options: [
        'quit india movement',
        'non cooperation movement',
        'civil disobedience movement',
        'swadeshi movement',
      ],
      correct_answer: 'non cooperation movement',
      explanation: 'The Non-Cooperation Movement was launched in 1920 to encourage Indians to withdraw cooperation from British institutions and goods.',
    },
    {
      question_text: 'The Jallianwala Bagh massacre took place in which year?',
      options: ['1915', '1919', '1922', '1930'],
      correct_answer: '1919',
      explanation: 'On April 13, 1919, British troops under General Reginald Dyer fired on a large gathering at Jallianwala Bagh in Amritsar.',
    },
    {
      question_text: 'Who led the Salt March in 1930?',
      options: [
        'subhas chandra bose',
        'jawaharlal nehru',
        'mahatma gandhi',
        'sardar vallabhbhai patel',
      ],
      correct_answer: 'mahatma gandhi',
      explanation: 'Mahatma Gandhi led the famous Dandi March in 1930 to protest the British salt tax and launch the Civil Disobedience Movement.',
    },
    {
      question_text: "Which movement was launched in 1942 with the famous call 'do or die'?",
      options: [
        'swadeshi movement',
        'non cooperation movement',
        'quit india movement',
        'home rule movement',
      ],
      correct_answer: 'quit india movement',
      explanation: "The Quit India Movement was launched by the Indian National Congress in August 1942, with Gandhi giving the famous call to 'do or die'.",
    },
    {
      question_text: 'Who was popularly known as netaji?',
      options: [
        'bhagat singh',
        'subhas chandra bose',
        'chandra shekhar azad',
        'lala lajpat rai',
      ],
      correct_answer: 'subhas chandra bose',
      explanation: 'Subhas Chandra Bose was popularly known as Netaji and became a prominent leader who sought to achieve Indian independence through armed struggle.',
    },
    {
      question_text: 'Which organization was led by Subhas Chandra Bose during the struggle against British rule?',
      options: [
        'indian national army',
        'home rule league',
        'servants of india society',
        'revolutionary socialist party',
      ],
      correct_answer: 'indian national army',
      explanation: 'Subhas Chandra Bose led the Indian National Army, also known as the Azad Hind Fauj, during the Second World War.',
    },
    {
      question_text: 'Who were the three revolutionaries executed by the British in 1931 for their role in revolutionary activities?',
      options: [
        'bhagat singh rajguru and sukhdev',
        'gandhi nehru and patel',
        'bose azad and tilak',
        'naoroji gokhale and rai',
      ],
      correct_answer: 'bhagat singh rajguru and sukhdev',
      explanation: 'Bhagat Singh, Shivaram Rajguru, and Sukhdev Thapar were executed by the British on March 23, 1931.',
    },
    {
      question_text: 'Which act of 1919 allowed the British government to imprison people without trial?',
      options: [
        'rowlatt act',
        'government of india act',
        'regulating act',
        'charter act',
      ],
      correct_answer: 'rowlatt act',
      explanation: 'The Rowlatt Act of 1919 gave the colonial government sweeping powers to detain people suspected of revolutionary activities without a normal trial.',
    },
    {
      question_text: 'Who was the first president of the Indian National Congress?',
      options: [
        'womesh chandra bonnerjee',
        'dadabhai naoroji',
        'surendranath banerjee',
        'bal gangadhar tilak',
      ],
      correct_answer: 'womesh chandra bonnerjee',
      explanation: 'Womesh Chandra Bonnerjee, also known as W C Bonnerjee, presided over the first session of the Indian National Congress in Bombay in 1885.',
    },
    {
      question_text: 'The partition of Bengal in 1905 led to the growth of which movement?',
      options: [
        'quit india movement',
        'swadeshi movement',
        'civil disobedience movement',
        'individual satyagraha',
      ],
      correct_answer: 'swadeshi movement',
      explanation: 'The partition of Bengal in 1905 triggered widespread protests and helped strengthen the Swadeshi Movement, which promoted Indian-made goods and boycotts of British products.',
    },
    {
      question_text: "Who gave the slogan 'swaraj is my birthright and i shall have it'?",
      options: [
        'bal gangadhar tilak',
        'dadabhai naoroji',
        'lala lajpat rai',
        'bipin chandra pal',
      ],
      correct_answer: 'bal gangadhar tilak',
      explanation: 'Bal Gangadhar Tilak was a prominent nationalist leader who popularized the demand for Swaraj, meaning self-rule.',
    },
    {
      question_text: 'On which date did India become independent from British rule?',
      options: [
        '26 january 1950',
        '15 august 1947',
        '9 august 1942',
        '26 november 1949',
      ],
      correct_answer: '15 august 1947',
      explanation: 'India became independent from British rule on August 15, 1947. Jawaharlal Nehru became the country first prime minister.',
    },
  ],
}

/**
 * Helper to seed a single quiz and its questions idempotently.
 */
async function seedQuizRecord(client: Client, seedData: QuizSeedData) {
  const now = Math.floor(Date.now() / 1000)
  const qData = seedData.quiz

  console.log(`🚀 Seeding quiz: "${qData.title}"...`)

  // 1. Fetch relevant tag IDs for mapping
  const tagPlaceholders = seedData.tagNames.map(() => '?').join(',')
  const tagRows = await client.execute({
    sql: `SELECT id, name FROM tags WHERE name IN (${tagPlaceholders});`,
    args: seedData.tagNames,
  })
  const tagIds = tagRows.rows.map((r: any) => Number(r.id))

  // 2. Insert or update the quiz
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

  console.log(`✓ Quiz record "${qData.title}" created/updated.`)

  // 3. Insert/update questions and link them
  let count = 0
  for (let i = 0; i < seedData.questions.length; i++) {
    const q = seedData.questions[i]
    const optionsJson = JSON.stringify(q.options)

    // Check if question exists
    const existing = await client.execute({
      sql: `SELECT id FROM questions WHERE question_text = ? LIMIT 1;`,
      args: [q.question_text],
    })

    let questionId: number

    if (existing.rows.length > 0) {
      questionId = Number(existing.rows[0].id)
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

    // Link question to quiz in quiz_questions
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

    // Attach tags to question
    for (const tId of tagIds) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO question_tags (question_id, tag_id, created_at) VALUES (?, ?, ?);`,
        args: [questionId, tId, now],
      })
    }

    count++
  }

  console.log(`🎉 Quiz "${qData.title}" seeded with ${count} questions and mapped tags!`)
}

function getTursoClient() {
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

  return createClient({ url, authToken })
}

export const WORLD_GEOGRAPHY_DATA: QuizSeedData = {
  quiz: {
    id: 'world-geography-and-landmarks',
    title: 'World Geography and Landmarks',
    slug: 'world-geography-and-landmarks',
    description: 'Test your knowledge of countries, cities, famous landmarks, monuments, and amazing places around the world',
    category: 'geography',
    difficulty: 'easy',
    timeLimitSeconds: 300,
    rewardXp: 150,
    isActive: true,
  },
  tagNames: ['geography', 'countries', 'capitals', 'landmarks'],
  questions: [
    {
      question_text: 'Which country is home to the Eiffel Tower?',
      options: ['italy', 'france', 'spain', 'germany'],
      correct_answer: 'france',
      explanation: "The Eiffel Tower is one of the world's most famous landmarks and is located in Paris, France.",
    },
    {
      question_text: 'What is the capital city of Japan?',
      options: ['kyoto', 'osaka', 'tokyo', 'hiroshima'],
      correct_answer: 'tokyo',
      explanation: 'Tokyo is the capital and largest metropolitan area of Japan.',
    },
    {
      question_text: 'In which country would you find the Great Wall?',
      options: ['china', 'japan', 'india', 'south korea'],
      correct_answer: 'china',
      explanation: 'The Great Wall is a vast series of fortifications built across northern China over many centuries.',
    },
    {
      question_text: 'Which city is famous for the Statue of Liberty?',
      options: ['los angeles', 'chicago', 'new york city', 'boston'],
      correct_answer: 'new york city',
      explanation: 'The Statue of Liberty stands on Liberty Island in New York Harbor.',
    },
    {
      question_text: 'Which country is shaped somewhat like a boot?',
      options: ['greece', 'italy', 'portugal', 'norway'],
      correct_answer: 'italy',
      explanation: 'Italy is famously described as having a boot-shaped peninsula extending into the Mediterranean Sea.',
    },
    {
      question_text: 'Where would you find the pyramids of giza?',
      options: ['egypt', 'mexico', 'peru', 'turkey'],
      correct_answer: 'egypt',
      explanation: 'The famous Pyramids of Giza are located near Cairo, Egypt.',
    },
    {
      question_text: 'Which is the largest ocean on earth?',
      options: ['atlantic ocean', 'indian ocean', 'arctic ocean', 'pacific ocean'],
      correct_answer: 'pacific ocean',
      explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
    },
    {
      question_text: 'Which city is known as the city of canals?',
      options: ['venice', 'paris', 'rome', 'vienna'],
      correct_answer: 'venice',
      explanation: 'Venice, Italy, is famous for its network of canals and waterways instead of conventional roads in many parts of the city.',
    },
    {
      question_text: 'Mount everest is located in which mountain range?',
      options: ['alps', 'rocky mountains', 'himalayas', 'andes'],
      correct_answer: 'himalayas',
      explanation: "Mount Everest is the world's highest mountain above sea level and is part of the Himalayan mountain range.",
    },
    {
      question_text: 'Which country is home to the taj mahal?',
      options: ['india', 'pakistan', 'bangladesh', 'nepal'],
      correct_answer: 'india',
      explanation: 'The Taj Mahal is a famous white marble monument in Agra, India, built by Mughal emperor Shah Jahan.',
    },
    {
      question_text: 'What is the capital city of australia?',
      options: ['sydney', 'melbourne', 'perth', 'canberra'],
      correct_answer: 'canberra',
      explanation: 'Canberra is the capital of Australia, while Sydney and Melbourne are two of its largest and best-known cities.',
    },
    {
      question_text: 'Which famous landmark is located in rio de janeiro?',
      options: ['big ben', 'christ the redeemer', 'colosseum', 'burj khalifa'],
      correct_answer: 'christ the redeemer',
      explanation: 'Christ the Redeemer is a huge statue overlooking Rio de Janeiro in Brazil.',
    },
    {
      question_text: 'Which country is home to the colosseum?',
      options: ['italy', 'greece', 'france', 'croatia'],
      correct_answer: 'italy',
      explanation: 'The Colosseum is an ancient Roman amphitheater located in the city of Rome, Italy.',
    },
    {
      question_text: 'Which desert is the largest hot desert in the world?',
      options: ['gobi desert', 'sahara desert', 'thar desert', 'kalahari desert'],
      correct_answer: 'sahara desert',
      explanation: 'The Sahara is the world largest hot desert and covers a huge area of northern Africa.',
    },
    {
      question_text: 'Which city is home to the famous big ben clock tower?',
      options: ['london', 'dublin', 'edinburgh', 'manchester'],
      correct_answer: 'london',
      explanation: 'Big Ben is the nickname commonly used for the great bell inside the Elizabeth Tower at the Palace of Westminster in London.',
    },
  ],
}

export async function seedSpaceTriviaQuiz() {
  const client = getTursoClient()
  await seedQuizRecord(client, SPACE_TRIVIA_DATA)
}

export async function seedIndianFreedomStruggleQuiz() {
  const client = getTursoClient()
  await seedQuizRecord(client, INDIAN_FREEDOM_STRUGGLE_DATA)
}

export async function seedWorldGeographyQuiz() {
  const client = getTursoClient()
  await seedQuizRecord(client, WORLD_GEOGRAPHY_DATA)
}

export async function seedAllQuizzes() {
  const client = getTursoClient()
  await seedQuizRecord(client, SPACE_TRIVIA_DATA)
  await seedQuizRecord(client, INDIAN_FREEDOM_STRUGGLE_DATA)
  await seedQuizRecord(client, WORLD_GEOGRAPHY_DATA)
}

if (
  process.argv[1]?.endsWith('seed-quizzes.ts') ||
  process.argv[1]?.endsWith('seed-quizzes.js') ||
  process.argv[1]?.endsWith('seed-quizzes.mjs')
) {
  seedAllQuizzes().catch((err) => {
    console.error('Fatal error seeding quizzes:', err)
    process.exit(1)
  })
}
