import { useState, useEffect, useCallback, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'

interface TagInfo {
  id: number
  name: string
  slug: string
  color: string
}

export interface QuestionItem {
  id: number
  questionText: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: TagInfo[]
  createdAt: string
}

export const ManageQuestionsPage: FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [allTags, setAllTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterTagId, setFilterTagId] = useState<string>('all')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const navigate = useNavigate()

  const loadQuestions = useCallback(() => {
    setLoading(true)
    fetch('/api/boss/questions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions || [])
        }
      })
      .catch((err) => console.error('Failed to load questions:', err))
      .finally(() => setLoading(false))
  }, [])

  const loadTags = () => {
    fetch('/api/boss/tags')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllTags(data.tags || [])
        }
      })
      .catch((err) => console.error('Failed to load tags:', err))
  }

  useEffect(() => {
    loadQuestions()
    loadTags()
  }, [loadQuestions])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question? It will be removed from all associated quizzes.')) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/boss/questions/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== id))
        setStatusMessage('Question deleted successfully.')
      } else {
        alert(data.message || 'Failed to delete question')
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting question')
    } finally {
      setDeletingId(null)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()))

    const matchesDifficulty =
      filterDifficulty === 'all' || q.difficulty === filterDifficulty

    const matchesTag =
      filterTagId === 'all' || q.tags.some((t) => String(t.id) === filterTagId)

    return matchesSearch && matchesDifficulty && matchesTag
  })

  return (
    <BossLayout
      title="Modular Questions Bank"
      subtitle="Catalog of reusable multiple-choice questions, mapped tags, and correct answers"
      action={
        <button
          type="button"
          className="btn btn-primary btn-sm fw-bold"
          onClick={() => navigate('/boss/question/new')}
        >
          + Add New Question
        </button>
      }
    >
      {statusMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3" role="alert">
          ✓ {statusMessage}
        </div>
      )}

      {/* Control Bar */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search questions by text or tags..."
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
            className="form-select bg-dark text-light border-secondary"
            value={filterTagId}
            onChange={(e) => setFilterTagId(e.target.value)}
          >
            <option value="all">All Topics / Tags</option>
            {allTags.map((t) => (
              <option key={t.id} value={String(t.id)}>
                #{t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="card bg-dark text-light border border-secondary shadow-sm">
        <div className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center">
          <span className="fw-semibold small text-muted text-uppercase">
            Questions ({filteredQuestions.length} of {questions.length})
          </span>
        </div>

        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
            Loading questions bank...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-5 text-center text-muted">
            No questions found matching your filter criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-active">
                <tr>
                  <th scope="col" style={{ width: '45%' }}>Question</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Correct Answer</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div className="fw-semibold text-light">{q.questionText}</div>
                      {q.explanation && (
                        <div className="text-muted small text-truncate" style={{ maxWidth: '380px' }} title={q.explanation}>
                          💡 {q.explanation}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          q.difficulty === 'easy'
                            ? 'text-bg-success'
                            : q.difficulty === 'hard'
                            ? 'text-bg-danger'
                            : 'text-bg-warning'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {q.tags.length === 0 ? (
                          <span className="text-muted small">No tags</span>
                        ) : (
                          q.tags.map((tag) => (
                            <span key={tag.id} className="badge text-bg-info">
                              #{tag.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-inline-flex align-items-center gap-1 text-success fw-bold">
                        <span>✓</span>
                        <span>{q.correctAnswer}</span>
                      </div>
                      <div className="text-muted small">
                        {Array.isArray(q.options) ? q.options.length : 0} options
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => navigate(`/boss/question/${q.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={deletingId === q.id}
                          onClick={() => handleDelete(q.id)}
                        >
                          {deletingId === q.id ? '...' : 'Delete'}
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
