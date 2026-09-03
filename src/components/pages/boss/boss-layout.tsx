import { useState, useEffect, type FC, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Chip } from '@heroui/react'
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
      <div className="boss-loading-screen">
        <div className="boss-loading-card">
          <div className="boss-scanner-circle">
            <span className="scanner-beam"></span>
            <Icon icon={Icons.rocketLaunch} size={40} />
          </div>
          <h3>Verifying Commander Credentials...</h3>
          <p>Scanning galactic clearance codes for Boss privileges</p>
        </div>
      </div>
    )
  }

  if (!isBoss) {
    return (
      <div className="boss-auth-restricted-container">
        <div className="boss-restricted-card">
          <div className="restricted-badge">
            <Icon icon={Icons.shieldCheck} size={48} />
          </div>
          <h2>Restricted Station: Boss Clearance Required</h2>
          <p className="restricted-desc">
            {user
              ? `Cadet ${user.name || user.email}, your current account does not have Boss (Admin) clearance configured in the database.`
              : 'You must be signed in with an authorized Boss account to enter this control hub.'}
          </p>

          <div className="restricted-actions">
            {!user ? (
              <Button
                className="boss-btn-primary"
                onClick={() => navigate('/login')}
              >
                Sign In With Boss Email
              </Button>
            ) : (
              <Button
                className="boss-btn-secondary"
                onClick={() => navigate('/profile')}
              >
                Check My Cadet Profile
              </Button>
            )}
            <Button
              className="boss-btn-ghost"
              onClick={() => navigate('/')}
            >
              Return to HQ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="boss-admin-root">
      {/* Top Cockpit Navigation Bar */}
      <header className="boss-topbar">
        <div className="boss-topbar-inner">
          <div className="boss-brand-group">
            <Link to="/boss" className="boss-brand-link">
              <div className="boss-logo-badge">⚡ BOSS</div>
              <span className="boss-brand-title">Mission Control</span>
            </Link>
            <Chip size="sm" variant="flat" className="boss-chip-role">
              Admin HQ
            </Chip>
          </div>

          <nav className="boss-nav-links">
            {navItems.map((item) => {
              const isActive =
                item.path === '/boss'
                  ? location.pathname === '/boss'
                  : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`boss-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon icon={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="boss-user-section">
            <div className="boss-user-pill">
              <span className="boss-user-dot"></span>
              <span className="boss-user-name">{user?.name || user?.email || 'Commander'}</span>
            </div>
            <Link to="/" className="boss-exit-btn" title="Back to Cadet App">
              <Icon icon={Icons.rocketLaunch} size={16} />
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="boss-main-content">
        <div className="boss-page-header">
          <div className="boss-page-header-text">
            <h1 className="boss-page-title">{title}</h1>
            {subtitle && <p className="boss-page-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="boss-page-action">{action}</div>}
        </div>

        <div className="boss-page-body">{children}</div>
      </main>
    </div>
  )
}
