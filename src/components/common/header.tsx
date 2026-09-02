import { useState, useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/icon'
import { Icons } from '../ui/icons'

export interface HeaderProps {
  onSwitchTab?: (tab: string) => void
  activeTab?: string
}

export interface UserSession {
  name?: string
  email: string
  avatarUrl?: string
}

export const Header: FC<HeaderProps> = ({ onSwitchTab }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    fetch('/api/auth/get-session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email) {
          const email = data.user.email
          const name = data.user.name || email.split('@')[0]
          const avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`
          setUser({ name, email, avatarUrl })
        }
      })
      .catch(() => {})
  }, [])

  const handleTabClick = (tabName: string) => {
    setDrawerOpen(false)
    if (onSwitchTab) {
      onSwitchTab(tabName)
    }
  }

  return (
    <>
      {/* Top Header / App Bar */}
      <header className="site-header">
        <div className="header-inner">
          {/* LEFT: Hamburger Menu Button */}
          <div className="header-left">
            <button
              id="hamburgerBtn"
              className="btn-hamburger"
              aria-label="Open Navigation Menu"
              title="Menu"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* MIDDLE: App Logo */}
          <div className="header-center">
            <Link to="/" className="logo-link" onClick={() => handleTabClick('hq')}>
              <img src="/neon.activities.logo.png" alt="Neon Activities" className="header-logo-img" />
            </Link>
          </div>

          {/* RIGHT: Login & User Info */}
          <div className="header-right">
            {user ? (
              <Link to="/profile" className="header-user-badge" title={`View Cadet Profile (${user.email})`}>
                <div className="user-avatar-mini">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'Avatar'}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Icon icon={Icons.astronautNoto} size={22} />
                  )}
                </div>
                <div className="user-info-text">
                  <span className="user-name-mini">{user.name || 'Cadet'}</span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="header-user-badge" title="Sign in with Email OTP">
                <div className="user-avatar-mini">
                  <Icon icon={Icons.astronautNoto} size={22} />
                </div>
                <div className="user-info-text">
                  <span className="user-name-mini">Sign In</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer & Backdrop */}
      <div
        className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className={`nav-drawer ${drawerOpen ? 'open' : ''}`} aria-label="Side Navigation Drawer">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <Link to="/" className="logo-link" onClick={() => handleTabClick('hq')}>
              <img src="/neon.activities.logo.png" alt="Neon Activities" className="drawer-logo-img" />
            </Link>
          </div>

          <button
            className="btn-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close Navigation Menu"
            title="Close Menu"
          >
            <Icon icon={Icons.close} size={20} />
          </button>
        </div>

        {/* Drawer Cadet Profile Info Card */}
        {user ? (
          <Link
            to="/profile"
            className="drawer-profile-box"
            title="View Cadet Profile Dossier"
            style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
            onClick={() => setDrawerOpen(false)}
          >
            <div className="drawer-profile-top">
              <div className="avatar-ring-sm">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'Avatar'}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <Icon icon={Icons.astronautNoto} size={28} />
                )}
              </div>
              <div>
                <div className="drawer-cadet-name">{user.name || 'Cadet Explorer'} 🧑‍🚀</div>
                <div className="drawer-cadet-rank">Level 1 • 350 / 500 XP</div>
              </div>
            </div>
            <div className="drawer-streak-pill">
              <span>🔥 7 Day Streak</span>
              <span style={{ color: 'var(--neon-gold)' }}>★ Silver Rank</span>
            </div>
          </Link>
        ) : (
          <Link
            to="/login"
            className="drawer-profile-box"
            title="Sign in with Email"
            style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
            onClick={() => setDrawerOpen(false)}
          >
            <div className="drawer-profile-top">
              <div className="avatar-ring-sm">
                <Icon icon={Icons.astronautNoto} size={28} />
              </div>
              <div>
                <div className="drawer-cadet-name">Cadet Login 🧑‍🚀</div>
                <div className="drawer-cadet-rank">Tap to Sign In</div>
              </div>
            </div>
          </Link>
        )}

        {/* Drawer Navigation List */}
        <nav className="drawer-nav">
          <div className="drawer-nav-section-title">MISSION ARENAS</div>
          <ul className="drawer-links">
            <li>
              <button className="drawer-link-btn" onClick={() => handleTabClick('hq')}>
                <div className="drawer-link-icon icon-cyan">
                  <Icon icon={Icons.rocketLaunch} size={18} />
                </div>
                <span>HQ & Daily Quests</span>
                <span className="drawer-badge badge-cyan">Active</span>
              </button>
            </li>
            <li>
              <button className="drawer-link-btn" onClick={() => handleTabClick('games')}>
                <div className="drawer-link-icon icon-pink">
                  <Icon icon={Icons.gamepad} size={18} />
                </div>
                <span>4 Core Game Arenas</span>
                <span className="drawer-badge badge-pink">4 Games</span>
              </button>
            </li>
            <li>
              <button className="drawer-link-btn" onClick={() => handleTabClick('journey')}>
                <div className="drawer-link-icon icon-gold">
                  <Icon icon={Icons.star} size={18} />
                </div>
                <span>Constellation Journey</span>
                <span className="drawer-badge badge-gold">Map</span>
              </button>
            </li>
            <li>
              <button className="drawer-link-btn" onClick={() => handleTabClick('parents')}>
                <div className="drawer-link-icon icon-green">
                  <Icon icon={Icons.shieldCheck} size={18} />
                </div>
                <span>Parent Hub & Safety</span>
                <span className="drawer-badge badge-green">COPPA</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => handleTabClick('parents')}
          >
            <Icon icon={Icons.sparkles} size={18} />
            <span>Download Mobile App</span>
          </button>
          <div className="drawer-footer-note">
            <span>© {new Date().getFullYear()} Neon Activities HQ</span>
          </div>
        </div>
      </aside>
    </>
  )
}
