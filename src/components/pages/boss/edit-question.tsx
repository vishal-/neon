import { useState, useEffect, type FC } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'

interface TagItem {
  id: number
  name: string
  slug: string
  color: string
}

export const EditQuestionPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()

  // Form State
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [category, setCategory] = useState('Cosmic Trivia')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

  // Tags Bank State
  const [allTags, setAllTags] = useState<TagItem[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [creatingTag, setCreatingTag] = useState(false)

  // Status
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch all tags
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
    loadTags()
  }, [])

  // If editing existing question, fetch its details
  useEffect(() => {
    if (isNew) return
    setLoading(true)
    fetch(`/api/boss/questions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.question) {
          const q = data.question
          setQuestionText(q.questionText || '')
          const opts = Array.isArray(q.options) && q.options.length > 0 ? q.options : ['', '']
          setOptions(opts)
          setCorrectAnswer(q.correctAnswer || '')
          setExplanation(q.explanation || '')
          setCategory(q.category || 'Cosmic Trivia')
          setDifficulty(q.difficulty || 'medium')
          setSelectedTagIds(Array.isArray(q.tags) ? q.tags.map((t: any) => t.id) : [])
        } else {
          setErrorMessage(data.message || 'Failed to load question')
        }
      })
      .catch((err) => setErrorMessage(err?.message || 'Error fetching question'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // Option handlers
  const handleOptionChange = (index: number, val: string) => {
    const prevVal = options[index]
    const updated = [...options]
    updated[index] = val
    setOptions(updated)

    if (correctAnswer === prevVal) {
      setCorrectAnswer(val)
    }
  }

  const handleAddOption = () => {
    if (options.length >= 6) return
    setOptions((prev) => [...prev, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return
    const removedVal = options[index]
    const updated = options.filter((_, idx) => idx !== index)
    setOptions(updated)
    if (correctAnswer === removedVal) {
      setCorrectAnswer(updated[0] || '')
    }
  }

  // Tag toggle handler
  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  // Quick create tag
  const handleQuickCreateTag = async () => {
    const name = newTagInput.trim()
    if (!name) return

    setCreatingTag(true)
    try {
      const colors = ['teal', 'purple', 'rose', 'gold', 'blue']
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const res = await fetch('/api/boss/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: randomColor }),
      })
      const data = await res.json()
      if (data.success && data.tag) {
        setAllTags((prev) => [...prev, data.tag])
        setSelectedTagIds((prev) => [...prev, data.tag.id])
        setNewTagInput('')
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create tag')
    } finally {
      setCreatingTag(false)
    }
  }

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      setErrorMessage('Question text is required.')
      return
    }

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean)
    if (cleanOptions.length < 2) {
      setErrorMessage('At least two valid non-empty options are required.')
      return
    }

    if (!correctAnswer.trim() || !cleanOptions.includes(correctAnswer.trim())) {
      setErrorMessage('Please select one of the options as the verified correct answer.')
      return
    }

    setSaving(true)
    setErrorMessage(null)
    setStatusMessage(null)

    const payload = {
      questionText: questionText.trim(),
      options: cleanOptions,
      correctAnswer: correctAnswer.trim(),
      explanation: explanation.trim(),
      category: category.trim(),
      difficulty,
      tagIds: selectedTagIds,
    }

    try {
      const url = isNew ? '/api/boss/questions' : `/api/boss/questions/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setStatusMessage(
          isNew ? 'Question created and saved to bank!' : 'Question updated successfully!'
        )
        if (isNew && data.question?.id) {
          setTimeout(() => navigate(`/boss/question/${data.question.id}`), 1000)
        }
      } else {
        setErrorMessage(data.message || 'Failed to save question')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error saving question')
    } finally {
      setSaving(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  // Delete question
  const handleDelete = async () => {
    if (!window.confirm('Delete this question permanently from the bank? It will be removed from all quizzes.')) {
      return
    }

    try {
      const res = await fetch(`/api/boss/questions/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        navigate('/boss/questions')
      } else {
        alert(data.message || 'Failed to delete question')
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting question')
    }
  }

  if (loading) {
    return (
      <BossLayout title="Loading Question..." subtitle="Retrieving question parameters">
        <div className="p-5 text-center text-muted">
          <div className="spinner-border text-info mb-2" role="status"></div>
          <div>Loading question from bank...</div>
        </div>
      </BossLayout>
    )
  }

  return (
    <BossLayout
      title={isNew ? 'Compose Question' : 'Edit Question'}
      subtitle={isNew ? 'Add a multiple-choice question to the reusable question bank' : `Question ID #${id}`}
      action={
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/boss/questions')}
          >
            &larr; Back
          </button>
          {!isNew && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            form="editQuestionForm"
            className="btn btn-primary btn-sm fw-bold px-3"
            disabled={saving}
          >
            {saving ? 'Saving...' : isNew ? 'Save to Bank' : 'Save Changes'}
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

      <form id="editQuestionForm" onSubmit={handleSave} className="row g-4">
        {/* Left Column: Stem & Options */}
        <div className="col-lg-7">
          <div className="card bg-dark text-light border border-secondary p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              Question Stem & Options
            </h5>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Question Text *</label>
              <textarea
                className="form-control bg-dark text-light border-secondary"
                rows={3}
                placeholder="e.g. Which planet in our solar system has the most prominent rings?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-semibold mb-0">Multiple-Choice Answer Options *</label>
                <span className="text-muted small">Select the radio of the correct answer</span>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                {options.map((opt, idx) => {
                  const isChecked = opt.trim() !== '' && correctAnswer === opt
                  return (
                    <div key={idx} className="input-group">
                      <span className={`input-group-text border-secondary ${isChecked ? 'bg-success text-white' : 'bg-black text-light'}`}>
                        <input
                          type="radio"
                          name="correct_answer_radio"
                          className="form-check-input mt-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => {
                            if (opt.trim()) {
                              setCorrectAnswer(opt)
                            }
                          }}
                          title="Click to mark as correct answer"
                        />
                        <span className="ms-2 fw-bold small">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </span>

                      <input
                        type="text"
                        className={`form-control bg-dark text-light border-secondary ${isChecked ? 'border-success' : ''}`}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        required
                      />

                      {options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveOption(idx)}
                          title="Remove option"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={handleAddOption}
                >
                  + Add Another Option
                </button>
              )}
            </div>

            <div className="mb-2">
              <label className="form-label small fw-semibold">Explanation / Fun Fact</label>
              <textarea
                className="form-control bg-dark text-light border-secondary"
                rows={2}
                placeholder="Shown to cadet after answering (e.g. Saturn is famous for its bright rings made of ice chunks and rock!)."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy */}
        <div className="col-lg-5">
          <div className="card bg-dark text-light border border-secondary p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              Taxonomy & Categorization
            </h5>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. Astronomy, Biology, Geography"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Difficulty Level</label>
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

            {/* Tags Selection */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-semibold mb-0">Attached Tags</label>
                <span className="text-muted small">{selectedTagIds.length} selected</span>
              </div>

              <div className="d-flex flex-wrap gap-1 p-2 rounded bg-black border border-secondary mb-3">
                {allTags.length === 0 ? (
                  <span className="text-muted small p-1">No tags configured yet. Create one below!</span>
                ) : (
                  allTags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        className={`btn btn-sm py-0 px-2 rounded-pill ${
                          isSelected ? 'btn-info fw-bold' : 'btn-outline-secondary text-light'
                        }`}
                        onClick={() => handleToggleTag(tag.id)}
                      >
                        {isSelected ? '✓ ' : '+ '}#{tag.name}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Quick Tag Creator */}
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control bg-black text-light border-secondary"
                  placeholder="Quick create tag (e.g. Solar System)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleQuickCreateTag()
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-info"
                  disabled={!newTagInput.trim() || creatingTag}
                  onClick={handleQuickCreateTag}
                >
                  {creatingTag ? '...' : '+ Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </BossLayout>
  )
}
