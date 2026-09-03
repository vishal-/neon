import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Input } from '@heroui/react'
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
        <Button
          className="boss-btn-primary"
          onClick={() => navigate('/boss/question/new')}
        >
          + Add New Question
        </Button>
      }
    >
      {statusMessage && (
        <div className="boss-toast-notification">
          <span>✓ {statusMessage}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="boss-filter-bar">
        <div className="boss-search-wrapper">
          <Input
            placeholder="Search questions by text or category..."
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

        <div className="boss-filter-group">
          <label className="boss-filter-label">Tag:</label>
          <select
            className="boss-select"
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
      <Card className="boss-table-card">
        {loading ? (
          <div className="boss-table-loading">Scanning question bank...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="boss-empty-placeholder">
            <Icon icon={Icons.brain} size={36} />
            <h3>No questions found matching criteria</h3>
            <p>Adjust your search filters or compose a brand new question with answers and tags.</p>
            <Button
              className="boss-btn-secondary"
              onClick={() => navigate('/boss/question/new')}
            >
              Compose Question
            </Button>
          </div>
        ) : (
          <div className="boss-table-responsive">
            <table className="boss-data-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Question</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Answer Options</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div className="table-main-title">{q.questionText}</div>
                      {q.explanation && (
                        <div className="table-sub-meta truncate" title={q.explanation}>
                          💡 {q.explanation}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="table-category-tag">
                        {q.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <Chip
                        size="sm"
                        variant="soft"
                        className={
                          q.difficulty === 'easy'
                            ? 'chip-green'
                            : q.difficulty === 'hard'
                            ? 'chip-rose'
                            : 'chip-gold'
                        }
                      >
                        {q.difficulty}
                      </Chip>
                    </td>
                    <td>
                      <div className="table-tags-cell">
                        {q.tags.length === 0 ? (
                          <span className="text-muted-xs">No tags</span>
                        ) : (
                          q.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              size="sm"
                              variant="soft"
                              className={`chip-${tag.color || 'teal'}`}
                            >
                              #{tag.name}
                            </Chip>
                          ))
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-answer-pill">
                        <span className="ans-check">✓</span>
                        <span className="ans-text">{q.correctAnswer}</span>
                      </div>
                      <div className="table-sub-meta">
                        {Array.isArray(q.options) ? q.options.length : 0} options
                      </div>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <Button
                          size="sm"
                          className="boss-btn-ghost"
                          onClick={() => navigate(`/boss/question/${q.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="boss-btn-danger"
                          isDisabled={deletingId === q.id}
                          onClick={() => handleDelete(q.id, q.questionText)}
                        >
                          {deletingId === q.id ? '...' : 'Delete'}
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
