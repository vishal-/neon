/**
 * Exhaustive list of Quiz Categories supported across Neon Activities.
 */
export const QUIZ_CATEGORIES = [
  'general',
  'science',
  'mathematics',
  'history',
  'geography',
  'english',
  'literature',
  'computers',
  'technology',
  'art',
  'music',
  'movies',
  'sports',
  'animals',
  'nature',
  'space',
  'health',
  'food',
  'business',
  'economics',
  'politics',
  'culture',
  'religion',
  'language',
  'logic',
  'puzzles',
  'entertainment',
  'currentevents',
] as const

export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]

/**
 * Validates that a tag string is strictly lowercase alphabetical (a-z)
 * with no spaces, numbers, or special characters.
 */
export function isValidTag(tag: string): boolean {
  return /^[a-z]+$/.test(tag)
}

/**
 * Sanitizes input into a valid alphabetical tag.
 */
export function sanitizeTag(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, '')
}
