import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

interface TagInfo {
  id: number
  name: string
  slug: string
  color: string
}

interface QuestionItem {
  id: number
  questionText: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  tags: TagInfo[]
  createdAt: string
}

export const ManageQuestionsPage: FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [allTags, setAllTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterTagId, setFilterTagId] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadQuestions = () => {
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
  }

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
  }, [])

  const handleDelete = async (id: number, text: string) => {
    const preview = text.length > 40 ? text.slice(0, 40) + '...' : text
    if (!window.confirm(`Are you sure you want to delete question "${preview}"? This will detach it from any quizzes.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/boss/questions/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setStatusMessage('Question deleted successfully.')
        setQuestions((prev) => prev.filter((q) => q.id !== id))
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
      (q.category && q.category.toLowerCase().includes(search.toLowerCase()))

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
            placeholder="Search questions by text or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3 d-flex align-items-center gap-2">
          <label className="text-muted small fw-semibold text-nowrap mb-0">Difficulty:</label>
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

        <div className="col-6 col-md-3 d-flex align-items-center gap-2">
          <label className="text-muted small fw-semibold text-nowrap mb-0">Tag:</label>
          <select
            className="form-select bg-dark text-light border-secondary"
            value={filterTagId}
            onChange={(e) => setFilterTagId(e.target.value)}
          >
            <option value="all">All Tags</option>
            {allTags.map((t) => (
              <option key={t.id} value={String(t.id)}>
                #{t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="card bg-dark text-light border border-secondary shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
            <span>Scanning question bank...</span>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div className="mb-2 text-warning">
              <Icon icon={Icons.brain} size={40} />
            </div>
            <h5 className="fw-bold text-light">No questions found matching criteria</h5>
            <p className="small mb-3">Adjust your search filters or compose a brand new question with answers and tags.</p>
            <button
              type="button"
              className="btn btn-outline-info btn-sm"
              onClick={() => navigate('/boss/question/new')}
            >
              Compose Question
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-active">
                <tr>
                  <th scope="col" style={{ width: '38%' }}>Question</th>
                  <th scope="col">Category</th>
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
                      <span className="badge text-bg-secondary bg-opacity-75">
                        {q.category || 'General'}
                      </span>
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
                          onClick={() => handleDelete(q.id, q.questionText)}
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
