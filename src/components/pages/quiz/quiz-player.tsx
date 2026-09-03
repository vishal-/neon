import { useState, useEffect, useCallback, type FC } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

interface QuizBriefing {
  id: string
  title: string
  slug: string
  description?: string
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimitSeconds: number
  rewardXp: number
}

interface PlayerQuestion {
  id: number
  questionText: string
  options: string[]
}

interface QuizReviewItem {
  questionId: number
  questionText: string
  options: string[]
  cadetAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation?: string | null
}

interface QuizResults {
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  totalXpAwarded: number
  timeTakenSeconds: number
  xpResult?: { totalXp: number; level: number } | null
  review: QuizReviewItem[]
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export const QuizPlayerPage: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [stage, setStage] = useState<'loading' | 'briefing' | 'playing' | 'submitting' | 'results' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Briefing state
  const [briefing, setBriefing] = useState<QuizBriefing | null>(null)
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0)
  const [activeAttempt, setActiveAttempt] = useState<{ id: string; expiresAt: string | null } | null>(null)
  const [latestCompleted, setLatestCompleted] = useState<{ score: number; totalQuestions: number; completedAt: string | null } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Active Quiz Playing state
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<PlayerQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [savedStatus, setSavedStatus] = useState<Record<number, 'saving' | 'saved' | 'error'>>({})
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)
  const [showJumpDrawer, setShowJumpDrawer] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Results state
  const [results, setResults] = useState<QuizResults | null>(null)

  // 1. Fetch Quiz Briefing Data
  const loadBriefing = useCallback(() => {
    if (!slug) return
    setStage('loading')
    setErrorMessage(null)

    fetch(`/api/quizzes/${encodeURIComponent(slug)}/briefing`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || 'Failed to load quiz briefing')
        }
        return res.json()
      })
      .then((data) => {
        setBriefing(data.quiz)
        setTotalQuestionsCount(data.totalQuestions || 0)
        setActiveAttempt(data.activeAttempt)
        setLatestCompleted(data.latestCompleted)
        setIsAuthenticated(data.authenticated)
        setStage('briefing')
      })
      .catch((err: any) => {
        setErrorMessage(err.message || 'Could not access cosmic coordinates for this quiz.')
        setStage('error')
      })
  }, [slug])

  useEffect(() => {
    loadBriefing()
  }, [loadBriefing])

  // 2. Start / Resume Quiz
  const handleStartQuiz = async () => {
    if (!slug) return
    setStage('loading')
    setErrorMessage(null)

    try {
      const res = await fetch(`/api/quizzes/${encodeURIComponent(slug)}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Failed to launch quiz mission')
      }

      setAttemptId(data.attemptId)
      setQuestions(data.questions || [])
      setSelectedAnswers(data.savedAnswers || {})
      setCurrentIndex(0)

      if (data.expiresAt) {
        const expDate = new Date(data.expiresAt)
        setExpiresAt(expDate)
        const diff = Math.max(0, Math.floor((expDate.getTime() - Date.now()) / 1000))
        setSecondsRemaining(diff)
      } else {
        setExpiresAt(null)
        setSecondsRemaining(null)
      }

      setStage('playing')
    } catch (err: any) {
      setErrorMessage(err.message || 'Error launching quiz mission')
      setStage('error')
    }
  }

  // 3. Submit for Backend Evaluation
  const handleSubmit = useCallback(async (_isAutoSubmit = false) => {
    if (!attemptId) return
    setShowSubmitModal(false)
    setStage('submitting')

    try {
      const res = await fetch(`/api/quizzes/attempts/${encodeURIComponent(attemptId)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Failed to evaluate quiz responses')
      }

      setResults(data)
      setStage('results')
    } catch (err: any) {
      setErrorMessage(err.message || 'Error grading your cosmic mission.')
      setStage('error')
    }
  }, [attemptId])

  // 4. Timer Countdown Effect
  useEffect(() => {
    if (stage !== 'playing' || !expiresAt) return

    const timer = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000))
      setSecondsRemaining(diff)

      if (diff <= 0) {
        clearInterval(timer)
        handleSubmit(true) // Auto submit on timer expiry
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [stage, expiresAt, handleSubmit])

  // 5. Select & Auto-Save Answer
  const handleSelectOption = async (qId: number, option: string) => {
    if (stage !== 'playing' || !attemptId) return

    // Optimistic local state update
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }))
    setSavedStatus((prev) => ({ ...prev, [qId]: 'saving' }))

    try {
      const res = await fetch(`/api/quizzes/attempts/${encodeURIComponent(attemptId)}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId, selectedAnswer: option }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (data.expired) {
          handleSubmit(true)
          return
        }
        throw new Error(data.message || 'Failed to save answer')
      }

      setSavedStatus((prev) => ({ ...prev, [qId]: 'saved' }))
    } catch {
      setSavedStatus((prev) => ({ ...prev, [qId]: 'error' }))
    }
  }

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // =========================================================================
  // STAGE: LOADING
  // =========================================================================
  if (stage === 'loading') {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4 text-center">
        <div className="spinner-border text-info mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold">Locking On Cosmic Coordinates...</h4>
        <p className="text-muted small">Synchronizing quiz bank and telemetry</p>
      </div>
    )
  }

  // =========================================================================
  // STAGE: ERROR
  // =========================================================================
  if (stage === 'error') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light p-3">
        <div className="card shadow-lg bg-dark border-danger p-4 p-md-5 text-center" style={{ maxWidth: '520px', borderRadius: '1.25rem' }}>
          <div className="text-danger mb-3">
            <Icon icon={Icons.close} size={48} />
          </div>
          <h3 className="fw-bold mb-2">Transmission Disrupted</h3>
          <p className="text-muted small mb-4">{errorMessage || 'Unable to access the quiz station.'}</p>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button type="button" className="btn btn-outline-info" onClick={loadBriefing}>
              Try Again
            </button>
            <Link to="/" className="btn btn-secondary">
              Return to HQ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // STAGE 1: BRIEFING SCREEN
  // =========================================================================
  if (stage === 'briefing' && briefing) {
    const mins = Math.floor(briefing.timeLimitSeconds / 60)
    const timeDisplay = briefing.timeLimitSeconds > 0 ? `${mins} Minute${mins !== 1 ? 's' : ''}` : 'Untimed'

    return (
      <div className="min-vh-100 bg-dark text-light d-flex flex-column">
        {/* Top Minimal Bar */}
        <header className="py-3 px-4 border-bottom border-secondary border-opacity-25 bg-black bg-opacity-40">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3">
              <span>&larr;</span>
              <span>Back to HQ</span>
            </Link>
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <img src="/neon.activities.logo.png" alt="Neon Activities" style={{ height: '34px', objectFit: 'contain' }} />
            </Link>
            <div>
              <span className="badge rounded-pill text-bg-info d-none d-sm-inline-block">🚀 Cosmic Arena</span>
            </div>
          </div>
        </header>

        {/* Main Briefing Stage */}
        <main className="flex-grow-1 container py-4 px-3 d-flex align-items-center justify-content-center">
          <div
            className="card shadow-lg border border-secondary bg-dark text-light overflow-hidden w-100"
            style={{ maxWidth: '640px', borderRadius: '1.25rem' }}
          >
            {/* Top Accent Gradient Bar */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #0dcaf0, #6610f2, #d63384)' }}></div>

            <div className="card-body p-4 p-md-5 text-center">
              {/* Category & Difficulty Badges */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                <span className="badge rounded-pill text-bg-primary text-uppercase px-3 py-1">
                  {briefing.category || 'Cosmic Trivia'}
                </span>
                <span
                  className={`badge rounded-pill px-3 py-1 text-uppercase ${
                    briefing.difficulty === 'easy'
                      ? 'text-bg-success'
                      : briefing.difficulty === 'hard'
                      ? 'text-bg-danger'
                      : 'text-bg-warning text-dark'
                  }`}
                >
                  {briefing.difficulty}
                </span>
                <span className="badge rounded-pill text-bg-info text-dark px-3 py-1 fw-bold">
                  ✨ +{briefing.rewardXp} XP Reward
                </span>
              </div>

              {/* Title & Description */}
              <h1 className="h2 fw-bold mb-2">{briefing.title}</h1>
              <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '480px' }}>
                {briefing.description || 'Test your galactic knowledge and conquer this cosmic quiz challenge!'}
              </p>

              {/* Parameters Grid */}
              <div className="row g-2 mb-4 text-start">
                <div className="col-6">
                  <div className="p-3 bg-black bg-opacity-30 rounded-3 border border-secondary border-opacity-25 h-100">
                    <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Questions</div>
                    <div className="fs-5 fw-bold text-info">
                      <Icon icon={Icons.quiz} size={20} className="me-1" />
                      {totalQuestionsCount}
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-3 bg-black bg-opacity-30 rounded-3 border border-secondary border-opacity-25 h-100">
                    <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Time Limit</div>
                    <div className="fs-5 fw-bold text-warning">
                      <Icon icon={Icons.clock} size={20} className="me-1" />
                      {timeDisplay}
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Completed Banner */}
              {latestCompleted && (
                <div className="alert alert-secondary py-2 px-3 small mb-4 text-center border-secondary border-opacity-50">
                  <span>Previous Run: </span>
                  <strong className="text-info">
                    {latestCompleted.score} / {latestCompleted.totalQuestions} Correct
                  </strong>
                  <span> • Retake to master and earn full score!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg fw-bold d-inline-flex align-items-center justify-content-center gap-2 py-3 shadow"
                  onClick={handleStartQuiz}
                >
                  <Icon icon={Icons.rocketLaunch} size={22} />
                  <span>{activeAttempt ? 'Resume Active Mission' : 'Launch Quiz Mission'}</span>
                </button>

                {!isAuthenticated && (
                  <p className="text-muted small mt-2 mb-0">
                    💡 Tip: <Link to={`/login?redirect=/quiz/${encodeURIComponent(briefing.slug)}`} className="text-info text-decoration-none fw-semibold">Sign in</Link> so your XP rewards are logged directly to your Cadet Dossier!
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================================
  // STAGE 2: ACTIVE QUIZ PLAYER (1 Question Per Page)
  // =========================================================================
  if (stage === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentIndex]
    const totalQ = questions.length
    const answeredCount = Object.keys(selectedAnswers).length
    const currentSelected = selectedAnswers[currentQuestion.id] || null
    const currentSaveState = savedStatus[currentQuestion.id] || null

    const isTimerUrgent = secondsRemaining !== null && secondsRemaining <= 60

    return (
      <div className="min-vh-100 bg-dark text-light d-flex flex-column">
        {/* Sticky Command Bar */}
        <header className="sticky-top bg-black bg-opacity-80 border-bottom border-secondary border-opacity-30 py-2 px-3 backdrop-blur shadow-sm">
          <div className="container-fluid d-flex align-items-center justify-content-between gap-2">
            {/* Left: Quit Button & Counter */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-2"
                title="Exit Quiz"
                onClick={() => {
                  if (confirm('Are you sure you want to exit? Your answers remain saved, but the timer keeps running!')) {
                    navigate('/')
                  }
                }}
              >
                ✕
              </button>
              <span className="badge bg-secondary bg-opacity-50 text-light fw-bold">
                Q {currentIndex + 1} / {totalQ}
              </span>
            </div>

            {/* Center: Live Synchronized Countdown Timer */}
            {secondsRemaining !== null && (
              <div
                className={`badge rounded-pill px-3 py-2 fw-bold fs-6 d-inline-flex align-items-center gap-1 ${
                  isTimerUrgent ? 'text-bg-danger' : 'text-bg-warning text-dark'
                }`}
                style={isTimerUrgent ? { animation: 'pulse 1s infinite' } : {}}
              >
                <Icon icon={Icons.clock} size={16} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            {/* Right: Question Navigator Toggle */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
                onClick={() => setShowJumpDrawer(!showJumpDrawer)}
              >
                <span>Jump</span>
                <span className="badge bg-info text-dark ms-1">{answeredCount}/{totalQ}</span>
              </button>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="progress mt-2" style={{ height: '3px', background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
            ></div>
          </div>
        </header>

        {/* Jump Drawer / Navigator Overlay */}
        {showJumpDrawer && (
          <div className="bg-black border-bottom border-secondary p-3 shadow-lg animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-bold text-muted text-uppercase">Question Map</span>
              <button type="button" className="btn-close btn-close-white small" onClick={() => setShowJumpDrawer(false)}></button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id]
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`btn btn-sm ${
                      isCurrent
                        ? 'btn-info text-dark fw-bold'
                        : isAnswered
                        ? 'btn-outline-success'
                        : 'btn-outline-secondary'
                    }`}
                    style={{ width: '42px', height: '38px' }}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setShowJumpDrawer(false)
                    }}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Single-Question Stage */}
        <main className="flex-grow-1 container py-4 px-3 d-flex flex-column justify-content-center align-items-center">
          <div
            className="card shadow-lg border border-secondary bg-dark text-light w-100 overflow-hidden"
            style={{ maxWidth: '640px', borderRadius: '1.25rem' }}
          >
            {/* Header indicator */}
            <div className="card-header bg-black bg-opacity-30 border-bottom border-secondary border-opacity-25 px-4 py-3 d-flex justify-content-between align-items-center">
              <span className="small text-muted text-uppercase fw-bold">
                Question {currentIndex + 1} of {totalQ}
              </span>
              <div className="small">
                {currentSaveState === 'saving' && <span className="text-warning">Saving...</span>}
                {currentSaveState === 'saved' && <span className="text-success">Saved ✓</span>}
                {currentSaveState === 'error' && <span className="text-danger">Failed to save!</span>}
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Question Text */}
              <h2 className="h4 fw-bold mb-4 text-light leading-relaxed" style={{ minHeight: '3.5rem' }}>
                {currentQuestion.questionText}
              </h2>

              {/* Options List */}
              <div className="d-flex flex-column gap-2 mb-2">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = currentSelected === opt
                  const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1)

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={`btn text-start p-3 rounded-3 d-flex align-items-center gap-3 transition-all ${
                        isSelected
                          ? 'btn-info text-dark fw-bold border-2 shadow'
                          : 'btn-outline-secondary text-light bg-black bg-opacity-25'
                      }`}
                      style={{ fontSize: '1rem', minHeight: '52px' }}
                      onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    >
                      <span
                        className={`d-flex align-items-center justify-content-center rounded-circle fw-bold ${
                          isSelected ? 'bg-dark text-info' : 'bg-secondary bg-opacity-25 text-muted'
                        }`}
                        style={{ width: '32px', height: '32px', flexShrink: 0 }}
                      >
                        {letter}
                      </span>
                      <span className="flex-grow-1 text-break">{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <footer className="sticky-bottom bg-black bg-opacity-90 border-top border-secondary border-opacity-30 py-3 px-3 backdrop-blur shadow">
          <div className="container-fluid d-flex align-items-center justify-content-between" style={{ maxWidth: '640px' }}>
            {/* Prev Button */}
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            >
              &larr; Prev
            </button>

            {/* Next or Submit Button */}
            {currentIndex < totalQ - 1 ? (
              <button
                type="button"
                className="btn btn-primary px-4 py-2 fw-bold"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
              >
                Next &rarr;
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success px-4 py-2 fw-bold shadow"
                onClick={() => {
                  if (answeredCount < totalQ) {
                    setShowSubmitModal(true)
                  } else {
                    handleSubmit(false)
                  }
                }}
              >
                Submit Quiz 🏁
              </button>
            )}
          </div>
        </footer>

        {/* Confirmation Modal for Unanswered Questions */}
        {showSubmitModal && (
          <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-light border-secondary">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title fw-bold">Unanswered Questions</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowSubmitModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    You have answered <strong className="text-info">{answeredCount}</strong> out of <strong className="text-light">{totalQ}</strong> questions.
                    Unanswered questions will be scored as incorrect. Are you sure you want to finish the mission now?
                  </p>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSubmitModal(false)}>
                    Keep Answering
                  </button>
                  <button type="button" className="btn btn-danger fw-bold" onClick={() => handleSubmit(false)}>
                    Submit Anyway
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // =========================================================================
  // STAGE: SUBMITTING / EVALUATING
  // =========================================================================
  if (stage === 'submitting') {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4 text-center">
        <div className="spinner-border text-info mb-3" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
          <span className="visually-hidden">Evaluating...</span>
        </div>
        <h3 className="fw-bold">Evaluating Cosmic Telemetry...</h3>
        <p className="text-muted small">Verifying coordinates, grading answers, and depositing earned XP into the ledger.</p>
      </div>
    )
  }

  // =========================================================================
  // STAGE 4: RESULTS & DEBRIEF SCREEN
  // =========================================================================
  if (stage === 'results' && results) {
    const isPassing = results.percentage >= 60

    return (
      <div className="min-vh-100 bg-dark text-light d-flex flex-column">
        {/* Top Header */}
        <header className="py-3 px-4 border-bottom border-secondary border-opacity-25 bg-black bg-opacity-40">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3">
              <span>&larr;</span>
              <span>Back to HQ</span>
            </Link>
            <span className="badge rounded-pill text-bg-info">Mission Debrief</span>
          </div>
        </header>

        {/* Results Container */}
        <main className="flex-grow-1 container py-4 px-3 d-flex flex-column align-items-center">
          <div
            className="card shadow-lg border border-secondary bg-dark text-light overflow-hidden w-100 mb-4"
            style={{ maxWidth: '680px', borderRadius: '1.25rem' }}
          >
            <div style={{ height: '4px', background: isPassing ? 'linear-gradient(90deg, #198754, #0dcaf0)' : 'linear-gradient(90deg, #dc3545, #ffc107)' }}></div>

            <div className="card-body p-4 p-md-5 text-center">
              {/* Score Badge Ring */}
              <div
                className={`d-inline-flex flex-column align-items-center justify-content-center rounded-circle border border-4 mb-3 ${
                  isPassing ? 'border-success bg-success bg-opacity-10' : 'border-warning bg-warning bg-opacity-10'
                }`}
                style={{ width: '130px', height: '130px' }}
              >
                <div className="h1 fw-bold mb-0 text-light">{results.score} / {results.totalQuestions}</div>
                <div className="small fw-semibold text-muted">{results.percentage}% Score</div>
              </div>

              {/* Title & Feedback */}
              <h2 className="h3 fw-bold mb-1">
                {isPassing ? '🎉 Cosmic Mission Accomplished!' : '⭐ Nice Attempt, Cadet!'}
              </h2>
              <p className="text-muted small mb-3">
                {isPassing
                  ? 'Outstanding navigation! You have demonstrated stellar knowledge of the cosmos.'
                  : 'Great effort! Review the explanations below and give it another spin to increase your score.'}
              </p>

              {/* XP Awarded Callout */}
              {results.totalXpAwarded > 0 ? (
                <div className="alert alert-success py-2 px-3 fw-bold d-inline-flex align-items-center gap-2 mb-4">
                  <Icon icon={Icons.sparkles} size={18} />
                  <span>+{results.totalXpAwarded} Cosmic XP Awarded to your Dossier!</span>
                </div>
              ) : (
                <div className="alert alert-secondary py-2 px-3 small d-inline-block mb-4">
                  No XP awarded for this run. Retake to earn points!
                </div>
              )}

              {/* Actions Row */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <button type="button" className="btn btn-primary px-4 py-2 fw-bold" onClick={handleStartQuiz}>
                  Retake Mission
                </button>
                <Link to="/profile" className="btn btn-outline-info px-4 py-2">
                  View My Profile
                </Link>
                <Link to="/" className="btn btn-outline-secondary px-4 py-2">
                  Return to HQ
                </Link>
              </div>

              {/* Detailed Question Review Accordion */}
              <div className="text-start mt-4 pt-4 border-top border-secondary border-opacity-25">
                <h4 className="h6 fw-bold text-muted text-uppercase mb-3">
                  Telemetry & Answer Review ({results.review.length} Questions)
                </h4>

                <div className="d-flex flex-column gap-3">
                  {results.review.map((item, idx) => (
                    <div
                      key={item.questionId}
                      className={`p-3 rounded-3 border ${
                        item.isCorrect
                          ? 'border-success border-opacity-50 bg-success bg-opacity-10'
                          : 'border-danger border-opacity-50 bg-danger bg-opacity-10'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <span className="small fw-bold text-muted">Question {idx + 1}</span>
                        <span className={`badge ${item.isCorrect ? 'text-bg-success' : 'text-bg-danger'}`}>
                          {item.isCorrect ? 'Correct ✓' : 'Incorrect ✕'}
                        </span>
                      </div>

                      <h5 className="fs-6 fw-bold mb-2 text-light">{item.questionText}</h5>

                      <div className="small mb-1">
                        <span className="text-muted">Your Answer: </span>
                        <strong className={item.isCorrect ? 'text-success' : 'text-danger'}>
                          {item.cadetAnswer}
                        </strong>
                      </div>

                      {!item.isCorrect && (
                        <div className="small mb-1">
                          <span className="text-muted">Correct Answer: </span>
                          <strong className="text-success">{item.correctAnswer}</strong>
                        </div>
                      )}

                      {item.explanation && (
                        <div className="mt-2 p-2 rounded bg-black bg-opacity-30 small text-info border border-secondary border-opacity-25">
                          💡 <em>{item.explanation}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return null
}
