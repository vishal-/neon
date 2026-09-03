import { useState, useEffect, type FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

interface DashboardStats {
  quizzesCount: number
  questionsCount: number
  tagsCount: number
  attemptsCount: number
  usersCount: number
}

interface RecentQuiz {
  id: string
  title: string
  slug: string
  difficulty: string
  category: string
  isActive: boolean
  createdAt: string
}

interface RecentQuestion {
  id: number
  questionText: string
  difficulty: string
  correctAnswer: string
}

export const BossDashboard: FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([])
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/boss/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats)
          setRecentQuizzes(data.recentQuizzes || [])
          setRecentQuestions(data.recentQuestions || [])
        }
      })
      .catch((err) => console.error('Failed to load boss stats:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <BossLayout
      title="Boss Cockpit & Galactic Command"
      subtitle="Manage interactive cosmic quizzes, questions bank, and curriculum tags"
      action={
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-info btn-sm fw-bold"
            onClick={() => navigate('/boss/question/new')}
          >
            + New Question
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm fw-bold"
            onClick={() => navigate('/boss/quiz/new')}
          >
            + Create Quiz
          </button>
        </div>
      }
    >
      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Quizzes Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 bg-dark text-light border border-secondary shadow-sm border-top border-4 border-info">
            <div className="card-body p-3 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-info">
                  <Icon icon={Icons.quiz} size={24} />
                </span>
                <span className="badge text-bg-info">Contests</span>
              </div>
              <div className="display-6 fw-bold mb-1">
                {loading ? '...' : stats?.quizzesCount ?? 0}
              </div>
              <div className="text-muted small mb-3">Active & Draft Quizzes</div>
              <Link to="/boss/quizzes" className="text-info text-decoration-none small fw-semibold">
                Manage Quizzes &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Questions Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 bg-dark text-light border border-secondary shadow-sm border-top border-4 border-primary">
            <div className="card-body p-3 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-primary">
                  <Icon icon={Icons.brain} size={24} />
                </span>
                <span className="badge text-bg-primary">Bank</span>
              </div>
              <div className="display-6 fw-bold mb-1">
                {loading ? '...' : stats?.questionsCount ?? 0}
              </div>
              <div className="text-muted small mb-3">Modular Questions</div>
              <Link to="/boss/questions" className="text-primary text-decoration-none small fw-semibold">
                Manage Questions &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Tags Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 bg-dark text-light border border-secondary shadow-sm border-top border-4 border-warning">
            <div className="card-body p-3 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-warning">
                  <Icon icon={Icons.sparkles} size={24} />
                </span>
                <span className="badge text-bg-warning">Taxonomy</span>
              </div>
              <div className="display-6 fw-bold mb-1">
                {loading ? '...' : stats?.tagsCount ?? 0}
              </div>
              <div className="text-muted small mb-3">Categorization Tags</div>
              <Link to="/boss/tags" className="text-warning text-decoration-none small fw-semibold">
                Manage Tags &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Activity Metric */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 bg-dark text-light border border-secondary shadow-sm border-top border-4 border-danger">
            <div className="card-body p-3 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-danger">
                  <Icon icon={Icons.trophy} size={24} />
                </span>
                <span className="badge text-bg-danger">Activity</span>
              </div>
              <div className="display-6 fw-bold mb-1">
                {loading ? '...' : stats?.attemptsCount ?? 0}
              </div>
              <div className="text-muted small mb-3">Total Cadet Attempts</div>
              <div className="text-muted small">
                {stats?.usersCount ?? 0} Registered Cadets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Operations */}
      <div className="mb-4">
        <h2 className="h5 fw-bold mb-3">Quick Galactic Operations</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100 bg-dark text-light border border-secondary p-3 shadow-sm">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-info bg-opacity-25 text-info">
                  <Icon icon={Icons.rocketLaunch} size={24} />
                </div>
                <h3 className="h6 fw-bold mb-0">Create Cosmic Quiz</h3>
              </div>
              <p className="text-muted small flex-grow-1">
                Compose a contest with custom questions, time limits, and XP rewards.
              </p>
              <button
                type="button"
                className="btn btn-primary w-100 btn-sm fw-bold"
                onClick={() => navigate('/boss/quiz/new')}
              >
                Launch Quiz Builder
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 bg-dark text-light border border-secondary p-3 shadow-sm">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-primary bg-opacity-25 text-primary">
                  <Icon icon={Icons.puzzle} size={24} />
                </div>
                <h3 className="h6 fw-bold mb-0">Add Bank Question</h3>
              </div>
              <p className="text-muted small flex-grow-1">
                Create reusable multiple-choice trivia with tags and explanations.
              </p>
              <button
                type="button"
                className="btn btn-outline-info w-100 btn-sm fw-bold"
                onClick={() => navigate('/boss/question/new')}
              >
                Add New Question
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 bg-dark text-light border border-secondary p-3 shadow-sm">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-warning bg-opacity-25 text-warning">
                  <Icon icon={Icons.sparkles} size={24} />
                </div>
                <h3 className="h6 fw-bold mb-0">Organize Tags</h3>
              </div>
              <p className="text-muted small flex-grow-1">
                Define topics, subjects, and difficulty levels with distinct badges.
              </p>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 btn-sm"
                onClick={() => navigate('/boss/tags')}
              >
                Open Tag Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Previews */}
      <div className="row g-4">
        {/* Recent Quizzes Card */}
        <div className="col-lg-6">
          <div className="card bg-dark text-light border border-secondary shadow-sm">
            <div className="card-header bg-black bg-opacity-50 border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center gap-2 fw-bold">
                <Icon icon={Icons.quiz} size={18} />
                <span>Recent Quizzes</span>
              </div>
              <Link to="/boss/quizzes" className="text-info text-decoration-none small">
                View All &rarr;
              </Link>
            </div>

            <div className="card-body p-0">
              {recentQuizzes.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p className="mb-2">No quizzes configured yet.</p>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => navigate('/boss/quiz/new')}
                  >
                    Create First Quiz
                  </button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="list-group-item bg-dark text-light border-secondary border-opacity-25 d-flex justify-content-between align-items-center py-2 px-3"
                    >
                      <div className="text-truncate me-2">
                        <div className="fw-semibold text-truncate">{quiz.title}</div>
                        <div className="text-muted small">
                          {quiz.category || 'Trivia'} • {quiz.slug}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
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
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          onClick={() => navigate(`/boss/quiz/${quiz.id}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Questions Card */}
        <div className="col-lg-6">
          <div className="card bg-dark text-light border border-secondary shadow-sm">
            <div className="card-header bg-black bg-opacity-50 border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center gap-2 fw-bold">
                <Icon icon={Icons.brain} size={18} />
                <span>Recent Questions Bank</span>
              </div>
              <Link to="/boss/questions" className="text-info text-decoration-none small">
                View All &rarr;
              </Link>
            </div>

            <div className="card-body p-0">
              {recentQuestions.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p className="mb-2">No questions in the question bank.</p>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => navigate('/boss/question/new')}
                  >
                    Add Question
                  </button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="list-group-item bg-dark text-light border-secondary border-opacity-25 d-flex justify-content-between align-items-center py-2 px-3"
                    >
                      <div className="text-truncate me-2">
                        <div className="fw-semibold text-truncate">{q.questionText}</div>
                        <div className="text-muted small">
                          Ans: <span className="text-info">{q.correctAnswer}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
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
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          onClick={() => navigate(`/boss/question/${q.id}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BossLayout>
  )
}
