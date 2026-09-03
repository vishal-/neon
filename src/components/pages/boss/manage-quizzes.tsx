import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'
import { QUIZ_CATEGORIES } from '../../../lib/constants'

interface QuizItem {
  id: string
  title: string
  slug: string
  description?: string
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimitSeconds: number
  rewardXp: number
  isActive: boolean
  questionsCount: number
  createdAt: string
}

export const ManageQuizzesPage: FC = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadQuizzes = () => {
    setLoading(true)
    fetch('/api/boss/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuizzes(data.quizzes || [])
        }
      })
      .catch((err) => console.error('Failed to load quizzes:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadQuizzes()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${title}"? This will also remove attempts logged for this quiz.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/boss/quizzes/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setStatusMessage(`Quiz "${title}" deleted successfully.`)
        setQuizzes((prev) => prev.filter((q) => q.id !== id))
      } else {
        alert(data.message || 'Failed to delete quiz')
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting quiz')
    } finally {
      setDeletingId(null)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const handleToggleActive = async (quiz: QuizItem) => {
    try {
      const res = await fetch(`/api/boss/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quiz,
          isActive: !quiz.isActive,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setQuizzes((prev) =>
          prev.map((q) => (q.id === quiz.id ? { ...q, isActive: !quiz.isActive } : q))
        )
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle status')
    }
  }

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.slug.toLowerCase().includes(search.toLowerCase()) ||
      (q.category && q.category.toLowerCase().includes(search.toLowerCase()))

    const matchesDifficulty =
      filterDifficulty === 'all' || q.difficulty === filterDifficulty

    const matchesCategory =
      filterCategory === 'all' || q.category === filterCategory

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  return (
    <BossLayout
      title="Manage Galactic Quizzes"
      subtitle="View, create, configure contests, time limits, and question assignments"
      action={
        <button
          type="button"
          className="btn btn-primary btn-sm fw-bold"
          onClick={() => navigate('/boss/quiz/new')}
        >
          + Create New Quiz
        </button>
      }
    >
      {statusMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3" role="alert">
          ✓ {statusMessage}
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search quizzes by title, slug, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select bg-dark text-light border-secondary"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select bg-dark text-light border-secondary text-capitalize"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {QUIZ_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quizzes Table Card */}
      <div className="card bg-dark text-light border border-secondary shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
            <span>Loading cosmic quizzes...</span>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div className="mb-2 text-warning">
              <Icon icon={Icons.quiz} size={40} />
            </div>
            <h5 className="fw-bold text-light">No quizzes match your filters</h5>
            <p className="small mb-3">Try clearing your search query or create a brand new quiz contest.</p>
            <button
              type="button"
              className="btn btn-outline-info btn-sm"
              onClick={() => navigate('/boss/quiz/new')}
            >
              Compose Quiz
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-active">
                <tr>
                  <th scope="col">Quiz Info</th>
                  <th scope="col">Category</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Questions</th>
                  <th scope="col">Time / XP</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="fw-semibold text-light">{quiz.title}</div>
                      <div className="text-muted small">/{quiz.slug}</div>
                    </td>
                    <td>
                      <span className="badge text-bg-secondary bg-opacity-75">
                        {quiz.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          quiz.difficulty === 'easy'
                            ? 'text-bg-success'
                            : quiz.difficulty === 'hard'
                            ? 'text-bg-danger'
                            : 'text-bg-warning'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="badge text-bg-primary">
                        {quiz.questionsCount} Questions
                      </span>
                    </td>
                    <td>
                      <div>
                        {quiz.timeLimitSeconds > 0 ? `${quiz.timeLimitSeconds}s` : 'Untimed'}
                      </div>
                      <div className="text-info small fw-bold">+{quiz.rewardXp} XP</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm py-0 px-2 fw-semibold ${
                          quiz.isActive ? 'btn-outline-success' : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleToggleActive(quiz)}
                        title="Click to toggle active status"
                      >
                        {quiz.isActive ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => navigate(`/boss/quiz/${quiz.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={deletingId === quiz.id}
                          onClick={() => handleDelete(quiz.id, quiz.title)}
                        >
                          {deletingId === quiz.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BossLayout>
  )
}
