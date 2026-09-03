import { useState, useEffect, type FC } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Input, TextArea } from '@heroui/react'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

interface BankQuestion {
  id: number
  questionText: string
  difficulty: string
  category: string
  correctAnswer: string
  tags?: Array<{ id: number; name: string; color: string }>
}

export const EditQuizPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Space Trivia')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(60)
  const [rewardXp, setRewardXp] = useState(150)
  const [isActive, setIsActive] = useState(true)

  // Assigned Questions State
  const [assignedQuestions, setAssignedQuestions] = useState<BankQuestion[]>([])
  const [allQuestions, setAllQuestions] = useState<BankQuestion[]>([])
  const [questionSearch, setQuestionSearch] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  // Status
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch all bank questions for selection
  useEffect(() => {
    fetch('/api/boss/questions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllQuestions(data.questions || [])
        }
      })
      .catch((err) => console.error('Failed to load bank questions:', err))
  }, [])

  // If editing existing quiz, fetch its details
  useEffect(() => {
    if (isNew) return
    setLoading(true)
    fetch(`/api/boss/quizzes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quiz) {
          const q = data.quiz
          setTitle(q.title || '')
          setSlug(q.slug || '')
          setDescription(q.description || '')
          setCategory(q.category || 'Space Trivia')
          setDifficulty(q.difficulty || 'medium')
          setTimeLimitSeconds(q.timeLimitSeconds ?? 60)
          setRewardXp(q.rewardXp ?? 150)
          setIsActive(q.isActive ?? true)
          setAssignedQuestions(data.questions || [])
        } else {
          setErrorMessage(data.message || 'Failed to load quiz')
        }
      })
      .catch((err) => setErrorMessage(err?.message || 'Error fetching quiz'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // Handle title change and auto-slug
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (isNew || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  // Question assignment helpers
  const handleAddQuestion = (question: BankQuestion) => {
    if (assignedQuestions.some((q) => q.id === question.id)) return
    setAssignedQuestions((prev) => [...prev, question])
  }

  const handleRemoveQuestion = (questionId: number) => {
    setAssignedQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= assignedQuestions.length) return

    const updated = [...assignedQuestions]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setAssignedQuestions(updated)
  }

  // Save quiz
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMessage('Quiz title cannot be empty.')
      return
    }

    setSaving(true)
    setErrorMessage(null)
    setStatusMessage(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      category: category.trim(),
      difficulty,
      timeLimitSeconds: Number(timeLimitSeconds) || 0,
      rewardXp: Number(rewardXp) || 100,
      isActive,
      questionIds: assignedQuestions.map((q) => q.id),
    }

    try {
      const url = isNew ? '/api/boss/quizzes' : `/api/boss/quizzes/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setStatusMessage(
          isNew ? 'Quiz launched successfully! Redirecting...' : 'Quiz updated successfully!'
        )
        if (isNew && data.quiz?.id) {
          setTimeout(() => navigate(`/boss/quiz/${data.quiz.id}`), 1000)
        }
      } else {
        setErrorMessage(data.message || 'Failed to save quiz')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error saving quiz')
    } finally {
      setSaving(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  // Delete quiz
  const handleDelete = async () => {
    if (!window.confirm('Are you certain you want to delete this quiz? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/boss/quizzes/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        navigate('/boss/quizzes')
      } else {
        alert(data.message || 'Failed to delete quiz')
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting quiz')
    }
  }

  if (loading) {
    return (
      <BossLayout title="Loading Quiz..." subtitle="Retrieving configuration from orbit">
        <div className="boss-table-loading">Loading quiz parameters...</div>
      </BossLayout>
    )
  }

  const unassignedQuestions = allQuestions.filter(
    (q) =>
      !assignedQuestions.some((assigned) => assigned.id === q.id) &&
      (q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.category.toLowerCase().includes(questionSearch.toLowerCase()))
  )

  return (
    <BossLayout
      title={isNew ? 'Compose New Quiz Contest' : `Edit Quiz: ${title}`}
      subtitle={
        isNew
          ? 'Assemble questions, set challenge timers, and define rewards'
          : `Slug: /${slug} • ${assignedQuestions.length} Questions Attached`
      }
      action={
        <div className="boss-actions-row">
          <Button
            className="boss-btn-ghost"
            onClick={() => navigate('/boss/quizzes')}
          >
            &larr; Back to Quizzes
          </Button>
          {!isNew && (
            <Button
              className="boss-btn-danger"
              onClick={handleDelete}
            >
              Delete Quiz
            </Button>
          )}
          <Button
            className="boss-btn-primary"
            onClick={handleSave}
            isDisabled={saving}
          >
            {saving ? 'Saving Orbit...' : isNew ? 'Publish Quiz' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      {statusMessage && (
        <div className="boss-toast-notification">
          <span>✓ {statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="boss-toast-notification boss-toast-error">
          <span>⚠ {errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="boss-editor-grid">
        {/* Left Column: Metadata Settings */}
        <div className="boss-editor-main">
          <Card className="boss-form-card">
            <h2 className="boss-form-section-title">Quiz Details & Branding</h2>

            <div className="boss-field-group">
              <label className="boss-label">Quiz Title *</label>
              <Input
                placeholder="e.g. Solar System Explorers Challenge"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="boss-input"
              />
            </div>

            <div className="boss-field-group">
              <label className="boss-label">URL Slug *</label>
              <Input
                placeholder="solar-system-explorers"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="boss-input"
              />
              <span className="boss-field-hint">Unique identifier used in URLs: /quiz/{slug || '...'}</span>
            </div>

            <div className="boss-field-group">
              <label className="boss-label">Description / Mission Brief</label>
              <TextArea
                placeholder="What will cadets explore or learn in this challenge?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="boss-textarea"
              />
            </div>

            <div className="boss-fields-row">
              <div className="boss-field-group half">
                <label className="boss-label">Category</label>
                <Input
                  placeholder="e.g. Astronomy, Logic, Trivia"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="boss-input"
                />
              </div>

              <div className="boss-field-group half">
                <label className="boss-label">Difficulty Level</label>
                <select
                  className="boss-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                >
                  <option value="easy">Easy (Cadet)</option>
                  <option value="medium">Medium (Explorer)</option>
                  <option value="hard">Hard (Commander)</option>
                </select>
              </div>
            </div>

            <div className="boss-fields-row">
              <div className="boss-field-group half">
                <label className="boss-label">Time Limit (Seconds, 0 = Untimed)</label>
                <Input
                  type="number"
                  min="0"
                  max="3600"
                  value={String(timeLimitSeconds)}
                  onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                  className="boss-input"
                />
              </div>

              <div className="boss-field-group half">
                <label className="boss-label">Reward XP for Completion</label>
                <Input
                  type="number"
                  min="10"
                  max="5000"
                  value={String(rewardXp)}
                  onChange={(e) => setRewardXp(Number(e.target.value))}
                  className="boss-input"
                />
              </div>
            </div>

            <div className="boss-field-group checkbox-row">
              <label className="boss-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Publish as Active (Visible to Cadets in Quests)</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Attached Questions Sequence */}
        <div className="boss-editor-sidebar">
          <Card className="boss-form-card">
            <div className="sidebar-card-header">
              <div>
                <h2 className="boss-form-section-title" style={{ margin: 0 }}>
                  Assigned Questions ({assignedQuestions.length})
                </h2>
                <span className="boss-field-hint">Reorder questions or add from the bank</span>
              </div>
              <Button
                size="sm"
                className="boss-btn-secondary"
                onClick={() => setPickerOpen(true)}
              >
                + Add Question
              </Button>
            </div>

            {assignedQuestions.length === 0 ? (
              <div className="assigned-empty-state">
                <Icon icon={Icons.brain} size={32} />
                <p>No questions mapped to this quiz yet.</p>
                <Button
                  size="sm"
                  className="boss-btn-primary"
                  onClick={() => setPickerOpen(true)}
                >
                  Browse Question Bank
                </Button>
              </div>
            ) : (
              <div className="assigned-questions-list">
                {assignedQuestions.map((q, idx) => (
                  <div key={q.id} className="assigned-q-item">
                    <div className="assigned-q-order">{idx + 1}</div>
                    <div className="assigned-q-content">
                      <div className="assigned-q-text">{q.questionText}</div>
                      <div className="assigned-q-meta">
                        <span className="ans-preview">Ans: {q.correctAnswer}</span>
                        <Chip size="sm" variant="soft" className="chip-purple">
                          {q.category}
                        </Chip>
                      </div>
                    </div>
                    <div className="assigned-q-controls">
                      <button
                        type="button"
                        className="btn-icon-order"
                        disabled={idx === 0}
                        onClick={() => handleMoveQuestion(idx, 'up')}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="btn-icon-order"
                        disabled={idx === assignedQuestions.length - 1}
                        onClick={() => handleMoveQuestion(idx, 'down')}
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="btn-icon-remove"
                        onClick={() => handleRemoveQuestion(q.id)}
                        title="Remove from Quiz"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </form>

      {/* Question Bank Picker Modal */}
      {pickerOpen && (
        <div className="boss-modal-backdrop" onClick={() => setPickerOpen(false)}>
          <div className="boss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="boss-modal-header">
              <div className="modal-title-group">
                <Icon icon={Icons.brain} size={24} />
                <h3>Select Questions from Bank</h3>
              </div>
              <button
                type="button"
                className="boss-modal-close"
                onClick={() => setPickerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="boss-modal-body">
              <div className="modal-search-bar">
                <Input
                  placeholder="Filter question bank..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="boss-search-input"
                />
              </div>

              <div className="modal-questions-list">
                {unassignedQuestions.length === 0 ? (
                  <div className="panel-empty-state">
                    <p>No unassigned questions found.</p>
                    <Button
                      size="sm"
                      className="boss-btn-secondary"
                      onClick={() => navigate('/boss/question/new')}
                    >
                      Create New Bank Question
                    </Button>
                  </div>
                ) : (
                  unassignedQuestions.map((q) => (
                    <div key={q.id} className="modal-q-item">
                      <div className="modal-q-details">
                        <div className="modal-q-text">{q.questionText}</div>
                        <div className="modal-q-tags">
                          <Chip size="sm" variant="soft" className="chip-gold">
                            {q.difficulty}
                          </Chip>
                          <Chip size="sm" variant="soft" className="chip-purple">
                            {q.category}
                          </Chip>
                          {q.tags?.map((t) => (
                            <Chip key={t.id} size="sm" variant="soft" className="chip-cyan">
                              #{t.name}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="boss-btn-primary"
                        onClick={() => handleAddQuestion(q)}
                      >
                        + Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="boss-modal-footer">
              <span>{assignedQuestions.length} questions attached to quiz</span>
              <Button
                className="boss-btn-primary"
                onClick={() => setPickerOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </BossLayout>
  )
}
