import { seedTags } from './seed-tags'
import { seedSpaceTriviaQuiz } from './seed-quizzes'

/**
 * Master Database Seeding Script
 * Orchestrates all database seeding operations.
 */
async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Seed Tags
    await seedTags()

    // 2. Seed Space Trivia Quiz & Questions
    await seedSpaceTriviaQuiz()

    console.log('✅ All database seeds executed successfully!')
  } catch (err) {
    console.error('❌ Database seeding failed:', err)
    process.exit(1)
  }
}

main()
