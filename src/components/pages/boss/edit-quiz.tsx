import { useState, useEffect, type FC } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'
import { QUIZ_CATEGORIES } from '../../../lib/constants'

interface BankQuestion {
  id: number
  questionText: string
  difficulty: string
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
  const [category, setCategory] = useState<string>('general')
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
          setCategory(q.category || 'general')
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

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMessage('Quiz Title is required.')
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
        setStatusMessage('Quiz configurations and question mappings saved successfully!')
        if (isNew && data.quiz?.id) {
          navigate(`/boss/quiz/${data.quiz.id}`, { replace: true })
        }
      } else {
        setErrorMessage(data.message || 'Failed to save quiz')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error updating quiz')
    } finally {
      setSaving(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const unassignedQuestions = allQuestions.filter(
    (q) =>
      !assignedQuestions.some((assigned) => assigned.id === q.id) &&
      (questionSearch === '' ||
        q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) ||
        (q.tags && q.tags.some((t) => t.name.toLowerCase().includes(questionSearch.toLowerCase()))))
  )

  if (loading) {
    return (
      <BossLayout title="Loading Quiz Editor...">
        <div className="p-5 text-center text-muted">
          <div className="spinner-border text-info mb-2" role="status"></div>
          <div>Loading quiz parameters...</div>
        </div>
      </BossLayout>
    )
  }

  return (
    <BossLayout
      title={isNew ? 'Create New Cosmic Quiz' : `Edit Quiz: ${title || 'Contest'}`}
      subtitle="Configure title, duration, question sequence, and cadet XP rewards"
      action={
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/boss/quizzes')}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editQuizForm"
            className="btn btn-primary btn-sm fw-bold px-3"
            disabled={saving}
          >
            {saving ? 'Saving...' : isNew ? 'Create Quiz' : 'Save Changes'}
          </button>
        </div>
      }
    >
      {statusMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3" role="alert">
          ✓ {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
          ⚠️ {errorMessage}
        </div>
      )}

      <form id="editQuizForm" onSubmit={handleSave} className="row g-4">
        {/* Left Column: Metadata */}
        <div className="col-lg-7">
          <div className="card bg-dark text-light border border-secondary p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              Quiz Metadata
            </h5>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Quiz Title *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. Solar Flares & Asteroid Belts"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">URL Slug</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="solar-flares-and-asteroids"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <div className="form-text text-muted small">
                Unique identifier used in URLs (e.g. /quiz/{slug || 'my-quiz'}).
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Description / Objective</label>
              <textarea
                className="form-control bg-dark text-light border-secondary"
                rows={3}
                placeholder="Test cadet knowledge of the inner solar system, planetary orbits, and meteor showers."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Category</label>
                <select
                  className="form-select bg-dark text-light border-secondary text-capitalize"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {QUIZ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Difficulty Tier</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                >
                  <option value="easy">Easy (Cadet)</option>
                  <option value="medium">Medium (Explorer)</option>
                  <option value="hard">Hard (Commander)</option>
                </select>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Time Limit (Seconds, 0 = Untimed)</label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  className="form-control bg-dark text-light border-secondary"
                  value={String(timeLimitSeconds)}
                  onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Reward XP for Completion</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  className="form-control bg-dark text-light border-secondary"
                  value={String(rewardXp)}
                  onChange={(e) => setRewardXp(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-check form-switch mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="isActiveSwitch">
                Publish as Active (Visible to Cadets in Quests)
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Questions */}
        <div className="col-lg-5">
          <div className="card bg-dark text-light border border-secondary p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              <div>
                <h5 className="fw-bold mb-0">Assigned Questions ({assignedQuestions.length})</h5>
                <div className="text-muted small">Reorder questions or add from bank</div>
              </div>
              <button
                type="button"
                className="btn btn-outline-info btn-sm fw-semibold"
                onClick={() => setPickerOpen(true)}
              >
                + Add
              </button>
            </div>

            {assignedQuestions.length === 0 ? (
              <div className="p-4 text-center text-muted border border-secondary border-dashed rounded">
                <div className="mb-2 text-warning">
                  <Icon icon={Icons.brain} size={32} />
                </div>
                <p className="small mb-2">No questions mapped to this quiz yet.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setPickerOpen(true)}
                >
                  Browse Question Bank
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {assignedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-2 px-3 rounded bg-black border border-secondary d-flex align-items-center gap-2"
                  >
                    <span className="badge text-bg-secondary rounded-circle px-2">{idx + 1}</span>
                    <div className="flex-grow-1 text-truncate">
                      <div className="small fw-semibold text-truncate">{q.questionText}</div>
                      <div className="text-muted small">
                        Ans: <span className="text-info">{q.correctAnswer}</span>
                      </div>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary py-0 px-1"
                        disabled={idx === 0}
                        onClick={() => handleMoveQuestion(idx, 'up')}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary py-0 px-1"
                        disabled={idx === assignedQuestions.length - 1}
                        onClick={() => handleMoveQuestion(idx, 'down')}
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger py-0 px-1"
                        onClick={() => handleRemoveQuestion(q.id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Question Bank Picker Modal */}
      {pickerOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setPickerOpen(false)}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-dark text-light border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <Icon icon={Icons.brain} size={22} />
                  <span>Select Questions from Bank</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPickerOpen(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="search"
                    className="form-control bg-black text-light border-secondary"
                    placeholder="Filter question bank by text or category..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>

                {unassignedQuestions.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <p className="mb-2">No unassigned questions found matching search.</p>
                    <button
                      type="button"
                      className="btn btn-outline-info btn-sm"
                      onClick={() => navigate('/boss/question/new')}
                    >
                      Create New Bank Question
                    </button>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {unassignedQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded bg-black border border-secondary d-flex align-items-center justify-content-between gap-3"
                      >
                        <div className="flex-grow-1 text-truncate">
                          <div className="fw-semibold text-truncate mb-1">{q.questionText}</div>
                          <div className="d-flex flex-wrap gap-1 align-items-center">
                            <span className="badge text-bg-warning">{q.difficulty}</span>
                            {q.tags?.map((t) => (
                              <span key={t.id} className="badge text-bg-info">
                                #{t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm flex-shrink-0"
                          onClick={() => handleAddQuestion(q)}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-secondary d-flex justify-content-between">
                <span className="text-muted small">{assignedQuestions.length} questions attached to quiz</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4"
                  onClick={() => setPickerOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BossLayout>
  )
}
