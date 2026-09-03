import { useState, useEffect, type FC, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export interface BossLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}

export interface BossAuthUser {
  id: string
  name: string
  email: string
  isBoss: boolean
}

export const BossLayout: FC<BossLayoutProps> = ({ children, title, subtitle, action }) => {
  const [loading, setLoading] = useState(true)
  const [isBoss, setIsBoss] = useState(false)
  const [user, setUser] = useState<BossAuthUser | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    fetch('/api/boss/auth-check')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.authenticated && data.isBoss) {
          setIsBoss(true)
          setUser(data.user)
        } else {
          setIsBoss(false)
          setUser(data.user || null)
        }
      })
      .catch(() => {
        if (!isMounted) return
        setIsBoss(false)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const navItems = [
    { label: 'Overview', path: '/boss', icon: Icons.rocketLaunch },
    { label: 'Quizzes', path: '/boss/quizzes', icon: Icons.quiz },
    { label: 'Questions', path: '/boss/questions', icon: Icons.brain },
    { label: 'Tags', path: '/boss/tags', icon: Icons.sparkles },
  ]

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4 text-center">
        <div className="spinner-border text-info mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold">Verifying Commander Credentials...</h4>
        <p className="text-muted small">Scanning galactic clearance codes for Boss privileges</p>
      </div>
    )
  }

  if (!isBoss) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light p-3">
        <div className="card shadow-lg bg-dark border-danger p-4 p-md-5 text-center" style={{ maxWidth: '500px', borderRadius: '1rem' }}>
          <div className="text-warning mb-3">
            <Icon icon={Icons.shieldCheck} size={54} />
          </div>
          <h3 className="fw-bold mb-2">Restricted Station: Boss Clearance Required</h3>
          <p className="text-muted small mb-4">
            {user
              ? `Cadet ${user.name || user.email}, your account does not have Boss (Admin) clearance configured in the database.`
              : 'You must be signed in with an authorized Boss account to enter this control hub.'}
          </p>

          <div className="d-flex flex-column gap-2">
            {!user ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Sign In With Boss Email
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-info"
                onClick={() => navigate('/profile')}
              >
                Check My Cadet Profile
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              Return to HQ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-dark text-light d-flex flex-column">
      {/* Top Cockpit Navbar */}
      <nav className="navbar navbar-expand navbar-dark bg-black border-bottom border-secondary border-opacity-50 sticky-top px-3 py-2">
        <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2">
          {/* Brand */}
          <div className="d-flex align-items-center gap-2">
            <Link to="/boss" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info m-0">
              <span className="badge text-bg-warning px-2 py-1">⚡ BOSS</span>
              <span className="fs-5 text-light">Mission Control</span>
            </Link>
            <span className="badge bg-secondary bg-opacity-50 text-light d-none d-sm-inline-block">Admin HQ</span>
          </div>

          {/* Navigation Links */}
          <ul className="nav nav-pills d-flex align-items-center gap-1 my-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/boss'
                  ? location.pathname === '/boss'
                  : location.pathname.startsWith(item.path)
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link py-1 px-3 rounded-pill d-flex align-items-center gap-1 ${
                      isActive ? 'active bg-primary text-white fw-bold' : 'text-light'
                    }`}
                  >
                    <Icon icon={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* User Info & Back Button */}
          <div className="d-flex align-items-center gap-2">
            <div className="badge bg-black border border-secondary text-info px-3 py-2 d-none d-md-flex align-items-center gap-1">
              <span className="rounded-circle bg-success d-inline-block" style={{ width: '8px', height: '8px' }}></span>
              <span>{user?.name || user?.email || 'Commander'}</span>
            </div>
            <Link to="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" title="Back to Cadet App">
              <Icon icon={Icons.rocketLaunch} size={15} />
              <span className="d-none d-sm-inline">App HQ</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Body */}
      <main className="container-fluid py-4 px-3 px-md-5 flex-grow-1">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h1 className="h3 fw-bold mb-1">{title}</h1>
            {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>

        <div>{children}</div>
      </main>
    </div>
  )
}
