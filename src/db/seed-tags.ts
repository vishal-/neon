import { createClient } from '@libsql/client/web'
import fs from 'fs'

/**
 * Raw tag seed list provided by user.
 */
export const SEED_TAGS_RAW = [
  'easy',
  'medium',
  'hard',
  'kids',
  'children',
  'students',
  'beginners',
  'experts',
  'general',
  'fun',
  'educational',
  'trivia',
  'knowledge',
  'facts',
  'brain',
  'logic',
  'memory',
  'puzzle',
  'challenge',
  'science',
  'biology',
  'chemistry',
  'physics',
  'astronomy',
  'space',
  'animals',
  'plants',
  'humanbody',
  'environment',
  'technology',
  'computers',
  'programming',
  'internet',
  'gadgets',
  'mathematics',
  'algebra',
  'geometry',
  'arithmetic',
  'statistics',
  'history',
  'ancienthistory',
  'modernhistory',
  'worldhistory',
  'indianhistory',
  'geography',
  'countries',
  'capitals',
  'continents',
  'landmarks',
  'maps',
  'english',
  'grammar',
  'vocabulary',
  'spelling',
  'literature',
  'books',
  'poetry',
  'movies',
  'hollywood',
  'bollywood',
  'music',
  'songs',
  'sports',
  'cricket',
  'football',
  'basketball',
  'tennis',
  'olympics',
  'food',
  'cooking',
  'health',
  'nutrition',
  'art',
  'painting',
  'culture',
  'india',
  'world',
  'festivals',
  'mythology',
  'inventions',
  'discoveries',
  'famouspeople',
  'animals', // duplicate
  'dinosaurs',
  'oceans',
  'weather',
  'environment', // duplicate
  'business',
  'economics',
  'finance',
  'leadership',
  'currentevents',
]

/**
 * Normalizes, validates (alphabetical only, lowercase, no spaces or special chars),
 * and deduplicates the tag list.
 */
export function getCleanTags(rawList: string[] = SEED_TAGS_RAW): string[] {
  const cleanSet = new Set<string>()

  for (const raw of rawList) {
    const clean = raw.trim().toLowerCase()
    // Strict validation: alphabetical only (a-z)
    if (/^[a-z]+$/.test(clean)) {
      cleanSet.add(clean)
    } else {
      console.warn(`[seed-tags] Skipping invalid tag "${raw}": must contain only lowercase letters (a-z).`)
    }
  }

  return Array.from(cleanSet).sort()
}

/**
 * Seeds the tags into Turso / LibSQL database if not already present.
 */
export async function seedTags() {
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
  const tagsToSeed = getCleanTags()

  console.log(`Starting tag seeding: ${tagsToSeed.length} unique alphabetical tags...`)

  let insertedCount = 0
  let skippedCount = 0

  const cosmicColors = ['teal', 'purple', 'rose', 'gold', 'blue']

  for (let i = 0; i < tagsToSeed.length; i++) {
    const tag = tagsToSeed[i]
    const color = cosmicColors[i % cosmicColors.length]
    const now = Math.floor(Date.now() / 1000)

    try {
      // Use INSERT OR IGNORE to be idempotent
      const res = await client.execute({
        sql: `INSERT OR IGNORE INTO tags (name, slug, description, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [tag, tag, `${tag} topic tag`, color, now, now],
      })
      if (res.rowsAffected > 0) {
        insertedCount++
      } else {
        skippedCount++
      }
    } catch (err: any) {
      console.error(`Error inserting tag "${tag}":`, err.message)
    }
  }

  console.log(`🎉 Seeding complete! Inserted: ${insertedCount}, Already Existed: ${skippedCount}, Total: ${tagsToSeed.length}`)
}

// Run directly if called from CLI
if (process.argv[1]?.endsWith('seed-tags.ts') || process.argv[1]?.endsWith('seed-tags.js') || process.argv[1]?.endsWith('seed-tags.mjs')) {
  seedTags().catch((err) => {
    console.error('Fatal error seeding tags:', err)
    process.exit(1)
  })
}
