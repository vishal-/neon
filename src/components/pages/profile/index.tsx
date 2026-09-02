import type { FC } from 'hono/jsx'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export interface ProfilePageProps {
  user: {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string | number
  }
  updated?: boolean
  error?: string
}

export const ProfilePage: FC<ProfilePageProps> = ({ user, updated, error }) => {
  const email = user.email || 'cadet@neonactivities.com'
  const cadetName = user.name || email.split('@')[0]
  const avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Today'

  return (
    <div className="page-wrapper profile-page-wrapper">
      {/* Background Ambience */}
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Top Header for Profile */}
      <header className="site-header profile-header">
        <div className="header-inner">
          <div className="header-left">
            <a href="/" className="btn-back-hq" title="Return to Cosmic HQ">
              <span className="back-arrow">←</span>
              <span>Back to HQ</span>
            </a>
          </div>

          <div className="header-center">
            <a href="/" className="logo-link" title="Neon Activities">
              <img src="/neon.activities.logo.png" alt="Neon Activities" className="header-logo-img" />
            </a>
          </div>

          <div className="header-right">
            <form method="POST" action="/logout" style={{ margin: 0 }}>
              <button 
                type="submit" 
                className="btn-header-secondary btn-signout" 
                title="Sign Out"
              >
                <Icon icon={Icons.login} size={16} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Profile Dossier Container */}
      <main className="profile-main-container">
        <div className="profile-card profile-auth-card">
          {/* Avatar & Header Section */}
          <div className="profile-top-section">
            <div className="profile-avatar-container">
              <div className="avatar-ring-glow"></div>
              <img 
                id="profileAvatarImg" 
                src={avatarUrl} 
                alt={`${cadetName}'s Fun Emoji Avatar`} 
                className="profile-avatar-large"
              />
              <div className="avatar-badge-tag" title="Dicebear Fun Emoji Avatar">
                <span>🎨 Fun Emoji</span>
              </div>
            </div>

            <div className="profile-title-group">
              <div className="profile-rank-pill">
                <span>🌟 Level 1 Cadet</span>
                <span className="dot-sep">•</span>
                <span className="verified-chip">✓ Verified Account</span>
              </div>
              <h1 id="profileDisplayName" className="profile-user-name">{cadetName}</h1>
              <p id="profileDisplayEmail" className="profile-user-email">{email}</p>
            </div>
          </div>

          {/* EDIT NAME SECTION */}
          <div className="profile-section-card">
            <div className="section-card-header">
              <div className="section-icon icon-teal">
                <Icon icon={Icons.profile} size={18} />
              </div>
              <div className="section-title-wrap">
                <h3 className="section-title">Edit Cadet Name</h3>
                <p className="section-subtitle">Change how your explorer name appears across leaderboards and games.</p>
              </div>
            </div>

            <form id="profileEditForm" className="profile-edit-form" method="POST" action="/profile">
              <div className="form-group">
                <label htmlFor="inputCadetName" className="form-label">Cadet / Explorer Name</label>
                <div className="input-row-inline">
                  <input 
                    id="inputCadetName" 
                    name="name"
                    type="text" 
                    className="auth-input profile-input" 
                    value={cadetName}
                    placeholder="Enter cadet name..." 
                    maxLength={50}
                    required 
                  />
                  <button id="btnSaveName" type="submit" className="btn-primary btn-save-name">
                    <span>Save Name</span>
                    <Icon icon={Icons.sparkles} size={16} />
                  </button>
                </div>
              </div>

              {updated && (
                <div className="auth-status-msg">
                  <span className="status-success">✨ Cadet name updated successfully!</span>
                </div>
              )}

              {error && (
                <div className="auth-status-msg">
                  <span className="status-error">⚠️ {error}</span>
                </div>
              )}
            </form>
          </div>

          {/* SAVED MISSION & ACCOUNT INFORMATION */}
          <div className="profile-section-card">
            <div className="section-card-header">
              <div className="section-icon icon-purple">
                <Icon icon={Icons.shieldCheck} size={18} />
              </div>
              <div className="section-title-wrap">
                <h3 className="section-title">Saved Cosmic Dossier</h3>
                <p className="section-subtitle">Your saved explorer progress, credentials, and security overview.</p>
              </div>
            </div>

            <div className="dossier-grid">
              <div className="dossier-item">
                <span className="dossier-label">EMAIL ADDRESS</span>
                <span className="dossier-value highlight">{email}</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">CADET ID</span>
                <span className="dossier-value code">{user.id.substring(0, 18)}...</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">MEMBER SINCE</span>
                <span className="dossier-value">{memberSince}</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">SECURITY METHOD</span>
                <span className="dossier-value">🚀 Passwordless Email OTP</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">TOTAL COSMIC XP</span>
                <span className="dossier-value highlight-gold">✨ 350 / 500 XP (Level 1)</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">DAILY STREAK</span>
                <span className="dossier-value highlight-pink">🔥 7 Days Active</span>
              </div>
            </div>
          </div>

          {/* ACTIONS ROW */}
          <div className="profile-footer-actions">
            <a href="/" className="btn-primary">
              <Icon icon={Icons.rocketLaunch} size={18} />
              <span>Launch Missions</span>
            </a>
            <form method="POST" action="/logout" style={{ flex: 1, margin: 0, display: 'flex' }}>
              <button type="submit" className="btn-secondary btn-signout-main" style={{ width: '100%' }}>
                <Icon icon={Icons.login} size={18} />
                <span>Sign Out of HQ</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

