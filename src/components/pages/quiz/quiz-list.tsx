import { useState, useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../../common/header'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'
import { QUIZ_CATEGORIES } from '../../../lib/constants'

interface PublicQuizItem {
  id: string
  title: string
  slug: string
  description?: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimitSeconds: number
  rewardXp: number
  questionCount: number
  createdAt: string
}

export const QuizListPage: FC = () => {
  const [quizzes, setQuizzes] = useState<PublicQuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes)
        }
      })
      .catch((err) => console.error('Failed to load quizzes:', err))
      .finally(() => setLoading(false))
  }, [])

  // Filter quizzes locally for instant feedback
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    const matchesSearch =
      !searchQuery.trim() ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  // Extract unique categories present in current quizzes
  const activeCategories = Array.from(new Set(quizzes.map((q) => q.category)))

  return (
    <div className="neon-app-container">
      <Header activeTab="games" />

      <main className="main-content flex-grow-1 py-4 px-2 px-md-3">
        <div className="container" style={{ maxWidth: '1140px' }}>
          {/* Hero Banner Card */}
          <div className="card bg-dark text-light border border-secondary border-opacity-50 p-4 p-md-5 text-center mb-4 rounded-4 shadow position-relative overflow-hidden">
            <div className="mb-3">
              <span className="badge text-bg-info text-dark px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2">
                <Icon icon={Icons.sparkles} size={16} />
                <span>Cosmic Knowledge Missions</span>
              </span>
            </div>

            <h1 className="display-6 fw-bolder mb-2 text-gradient-cyan">
              Galactic Quiz Arenas 🚀
            </h1>

            <p className="lead text-light text-opacity-75 mx-auto mb-0" style={{ maxWidth: '650px' }}>
              Pick your arena, test your cosmic mastery across science, geography, and history, and earn XP to rank up your cadet level!
            </p>
          </div>

          {/* Controls Bar: Search & Difficulty Filter */}
          <div className="row g-3 align-items-center justify-content-between mb-3">
            {/* Search Input */}
            <div className="col-12 col-md-6 position-relative">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <Icon icon={Icons.search} size={18} />
                </span>
                <input
                  type="search"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Search quests by title, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty Toggle Buttons */}
            <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`btn btn-sm text-capitalize px-3 rounded-pill fw-semibold ${
                    selectedDifficulty === diff
                      ? diff === 'easy'
                        ? 'btn-success'
                        : diff === 'hard'
                        ? 'btn-danger'
                        : diff === 'medium'
                        ? 'btn-warning text-dark'
                        : 'btn-info text-dark'
                      : 'btn-outline-secondary text-light'
                  }`}
                >
                  {diff === 'all' ? 'All Difficulties' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm rounded-pill px-3 text-nowrap fw-bold ${
                selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary text-light'
              }`}
            >
              🌟 All Quizzes ({quizzes.length})
            </button>

            {QUIZ_CATEGORIES.filter((cat) => activeCategories.includes(cat)).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-pill px-3 text-nowrap text-capitalize fw-semibold ${
                  selectedCategory === cat ? 'btn-info text-dark' : 'btn-outline-secondary text-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5 text-info">
              <div className="spinner-border mb-3" role="status"></div>
              <div className="fw-semibold">Scanning Galactic Frequencies...</div>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-5 bg-dark bg-opacity-50 rounded-4 border border-secondary border-dashed p-4 my-3">
              <div className="display-4 mb-3">🛸</div>
              <h3 className="text-light mb-2">No Quizzes Found</h3>
              <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '420px' }}>
                We couldn't find any missions matching your current search or category filters.
              </p>
              <button
                type="button"
                className="btn btn-outline-info btn-sm px-4 rounded-pill fw-bold"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Quizzes Grid */
            <div className="row g-4">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 bg-dark text-light border border-secondary border-opacity-50 shadow-sm rounded-4 d-flex flex-column justify-content-between p-3 p-sm-4">
                    <div>
                      {/* Badges Row */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge text-bg-primary text-uppercase px-2 py-1">
                          {quiz.category}
                        </span>

                        <span
                          className={`badge px-2 py-1 text-capitalize ${
                            quiz.difficulty === 'easy'
                              ? 'text-bg-success'
                              : quiz.difficulty === 'hard'
                              ? 'text-bg-danger'
                              : 'text-bg-warning'
                          }`}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="card-title fw-bold text-light text-capitalize mb-2">
                        {quiz.title}
                      </h4>

                      {/* Description */}
                      <p className="card-text text-secondary small mb-4" style={{ minHeight: '2.8rem' }}>
                        {quiz.description || 'Test your cosmic knowledge and unlock galactic mastery!'}
                      </p>
                    </div>

                    {/* Metadata & Launch CTA */}
                    <div>
                      <div className="p-2 px-3 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center small text-light mb-3">
                        <span>⏱ {Math.round((quiz.timeLimitSeconds || 300) / 60)} Mins</span>
                        <span>❓ {quiz.questionCount} Questions</span>
                        <span className="text-warning fw-bold">⭐ +{quiz.rewardXp} XP</span>
                      </div>

                      <Link
                        to={`/quiz/${quiz.slug}`}
                        className="btn btn-primary w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none shadow"
                      >
                        <span>Launch Mission</span>
                        <span>🚀</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-top border-secondary border-opacity-25 py-4 text-center text-secondary small mt-auto">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <img src="/neon.activities.logo.png" alt="Neon Activities" style={{ height: '24px', opacity: 0.8 }} />
        </div>
        <div>Neon Galactic Activities • Ad-Free, Safe, and Curious Explorations for Cadets 🚀</div>
      </footer>
    </div>
  )
}
