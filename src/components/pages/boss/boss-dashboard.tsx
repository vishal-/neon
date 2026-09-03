import { useState, useEffect, type FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Chip } from '@heroui/react'
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
  category: string
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
        <div className="boss-actions-row">
          <Button
            className="boss-btn-secondary"
            onClick={() => navigate('/boss/question/new')}
          >
            + New Question
          </Button>
          <Button
            className="boss-btn-primary"
            onClick={() => navigate('/boss/quiz/new')}
          >
            + Create Quiz
          </Button>
        </div>
      }
    >
      {/* Metric Cards Grid */}
      <div className="boss-metrics-grid">
        <Card className="boss-metric-card metric-cyan">
          <div className="boss-metric-top">
            <span className="boss-metric-icon">
              <Icon icon={Icons.quiz} size={24} />
            </span>
            <Chip size="sm" variant="flat" className="chip-cyan">
              Contests
            </Chip>
          </div>
          <div className="boss-metric-number">
            {loading ? '...' : stats?.quizzesCount ?? 0}
          </div>
          <div className="boss-metric-label">Active & Draft Quizzes</div>
          <Link to="/boss/quizzes" className="boss-metric-footer">
            Manage Quizzes &rarr;
          </Link>
        </Card>

        <Card className="boss-metric-card metric-purple">
          <div className="boss-metric-top">
            <span className="boss-metric-icon">
              <Icon icon={Icons.brain} size={24} />
            </span>
            <Chip size="sm" variant="flat" className="chip-purple">
              Bank
            </Chip>
          </div>
          <div className="boss-metric-number">
            {loading ? '...' : stats?.questionsCount ?? 0}
          </div>
          <div className="boss-metric-label">Modular Questions</div>
          <Link to="/boss/questions" className="boss-metric-footer">
            Manage Questions &rarr;
          </Link>
        </Card>

        <Card className="boss-metric-card metric-gold">
          <div className="boss-metric-top">
            <span className="boss-metric-icon">
              <Icon icon={Icons.sparkles} size={24} />
            </span>
            <Chip size="sm" variant="flat" className="chip-gold">
              Taxonomy
            </Chip>
          </div>
          <div className="boss-metric-number">
            {loading ? '...' : stats?.tagsCount ?? 0}
          </div>
          <div className="boss-metric-label">Categorization Tags</div>
          <Link to="/boss/tags" className="boss-metric-footer">
            Manage Tags &rarr;
          </Link>
        </Card>

        <Card className="boss-metric-card metric-rose">
          <div className="boss-metric-top">
            <span className="boss-metric-icon">
              <Icon icon={Icons.trophy} size={24} />
            </span>
            <Chip size="sm" variant="flat" className="chip-rose">
              Activity
            </Chip>
          </div>
          <div className="boss-metric-number">
            {loading ? '...' : stats?.attemptsCount ?? 0}
          </div>
          <div className="boss-metric-label">Total Cadet Attempts</div>
          <div className="boss-metric-footer text-muted">
            {stats?.usersCount ?? 0} Registered Cadets
          </div>
        </Card>
      </div>

      {/* Quick Launch Cards */}
      <div className="boss-quick-actions-section">
        <h2 className="boss-section-title">Quick Galactic Operations</h2>
        <div className="boss-quick-grid">
          <Card className="boss-quick-card">
            <div className="quick-card-icon bg-cyan">
              <Icon icon={Icons.rocketLaunch} size={28} />
            </div>
            <div className="quick-card-info">
              <h3>Create Cosmic Quiz</h3>
              <p>Compose a contest with custom questions, time limits, and XP rewards.</p>
            </div>
            <Button
              className="boss-btn-primary full-width"
              onClick={() => navigate('/boss/quiz/new')}
            >
              Launch Quiz Builder
            </Button>
          </Card>

          <Card className="boss-quick-card">
            <div className="quick-card-icon bg-purple">
              <Icon icon={Icons.puzzle} size={28} />
            </div>
            <div className="quick-card-info">
              <h3>Add Bank Question</h3>
              <p>Create reusable multiple-choice trivia with tags and explanations.</p>
            </div>
            <Button
              className="boss-btn-secondary full-width"
              onClick={() => navigate('/boss/question/new')}
            >
              Add New Question
            </Button>
          </Card>

          <Card className="boss-quick-card">
            <div className="quick-card-icon bg-gold">
              <Icon icon={Icons.sparkles} size={28} />
            </div>
            <div className="quick-card-info">
              <h3>Organize Tags</h3>
              <p>Define topics, subjects, and age levels with distinct colored badges.</p>
            </div>
            <Button
              className="boss-btn-ghost full-width"
              onClick={() => navigate('/boss/tags')}
            >
              Open Tag Manager
            </Button>
          </Card>
        </div>
      </div>

      {/* Recent Activity Previews */}
      <div className="boss-split-grid">
        {/* Recent Quizzes Card */}
        <Card className="boss-panel-card">
          <div className="panel-card-header">
            <div className="panel-title-group">
              <Icon icon={Icons.quiz} size={20} />
              <h3>Recent Quizzes</h3>
            </div>
            <Link to="/boss/quizzes" className="panel-link">
              View All &rarr;
            </Link>
          </div>

          <div className="panel-list">
            {recentQuizzes.length === 0 ? (
              <div className="panel-empty-state">
                <p>No quizzes configured yet.</p>
                <Button
                  className="boss-btn-secondary"
                  size="sm"
                  onClick={() => navigate('/boss/quiz/new')}
                >
                  Create First Quiz
                </Button>
              </div>
            ) : (
              recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="panel-item">
                  <div className="panel-item-info">
                    <span className="panel-item-title">{quiz.title}</span>
                    <span className="panel-item-meta">
                      {quiz.category || 'Trivia'} • {quiz.slug}
                    </span>
                  </div>
                  <div className="panel-item-actions">
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
                    <Button
                      size="sm"
                      className="boss-btn-ghost"
                      onClick={() => navigate(`/boss/quiz/${quiz.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Questions Card */}
        <Card className="boss-panel-card">
          <div className="panel-card-header">
            <div className="panel-title-group">
              <Icon icon={Icons.brain} size={20} />
              <h3>Recent Questions Bank</h3>
            </div>
            <Link to="/boss/questions" className="panel-link">
              View All &rarr;
            </Link>
          </div>

          <div className="panel-list">
            {recentQuestions.length === 0 ? (
              <div className="panel-empty-state">
                <p>No questions created in question bank.</p>
                <Button
                  className="boss-btn-secondary"
                  size="sm"
                  onClick={() => navigate('/boss/question/new')}
                >
                  Add Question
                </Button>
              </div>
            ) : (
              recentQuestions.map((q) => (
                <div key={q.id} className="panel-item">
                  <div className="panel-item-info">
                    <span className="panel-item-title truncate">
                      {q.questionText}
                    </span>
                    <span className="panel-item-meta">
                      Ans: {q.correctAnswer}
                    </span>
                  </div>
                  <div className="panel-item-actions">
                    <Chip size="sm" variant="flat" className="chip-purple">
                      {q.category || 'General'}
                    </Chip>
                    <Button
                      size="sm"
                      className="boss-btn-ghost"
                      onClick={() => navigate(`/boss/question/${q.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </BossLayout>
  )
}
