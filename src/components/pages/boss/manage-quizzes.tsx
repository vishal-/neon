import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Input } from '@heroui/react'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

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

    return matchesSearch && matchesDifficulty
  })

  return (
    <BossLayout
      title="Manage Galactic Quizzes"
      subtitle="View, create, configure contests, time limits, and question assignments"
      action={
        <Button
          className="boss-btn-primary"
          onClick={() => navigate('/boss/quiz/new')}
        >
          + Create New Quiz
        </Button>
      }
    >
      {statusMessage && (
        <div className="boss-toast-notification">
          <span>✓ {statusMessage}</span>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="boss-filter-bar">
        <div className="boss-search-wrapper">
          <Input
            placeholder="Search quizzes by title, slug, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="boss-search-input"
          />
        </div>

        <div className="boss-filter-group">
          <label className="boss-filter-label">Difficulty:</label>
          <select
            className="boss-select"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Quizzes Table Card */}
      <Card className="boss-table-card">
        {loading ? (
          <div className="boss-table-loading">Loading cosmic quizzes...</div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="boss-empty-placeholder">
            <Icon icon={Icons.quiz} size={36} />
            <h3>No quizzes match your filters</h3>
            <p>Try clearing your search query or create a brand new quiz contest.</p>
            <Button
              className="boss-btn-secondary"
              onClick={() => navigate('/boss/quiz/new')}
            >
              Compose Quiz
            </Button>
          </div>
        ) : (
          <div className="boss-table-responsive">
            <table className="boss-data-table">
              <thead>
                <tr>
                  <th>Quiz Info</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Time / XP</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="table-main-title">{quiz.title}</div>
                      <div className="table-sub-meta">/{quiz.slug}</div>
                    </td>
                    <td>
                      <span className="table-category-tag">
                        {quiz.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <Chip
                        size="sm"
                        variant="flat"
                        className={
                          quiz.difficulty === 'easy'
                            ? 'chip-green'
                            : quiz.difficulty === 'hard'
                            ? 'chip-rose'
                            : 'chip-gold'
                        }
                      >
                        {quiz.difficulty}
                      </Chip>
                    </td>
                    <td>
                      <Chip size="sm" variant="flat" className="chip-purple">
                        {quiz.questionsCount} Questions
                      </Chip>
                    </td>
                    <td>
                      <div className="table-num-stat">
                        {quiz.timeLimitSeconds > 0
                          ? `${quiz.timeLimitSeconds}s`
                          : 'Untimed'}
                      </div>
                      <div className="table-sub-meta">+{quiz.rewardXp} XP</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`status-pill-toggle ${quiz.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleActive(quiz)}
                        title="Click to toggle status"
                      >
                        <span className="status-dot"></span>
                        <span>{quiz.isActive ? 'Active' : 'Draft'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <Button
                          size="sm"
                          className="boss-btn-ghost"
                          onClick={() => navigate(`/boss/quiz/${quiz.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="boss-btn-danger"
                          isDisabled={deletingId === quiz.id}
                          onClick={() => handleDelete(quiz.id, quiz.title)}
                        >
                          {deletingId === quiz.id ? '...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </BossLayout>
  )
}
