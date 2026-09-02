import { useState, useEffect, type FC, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export interface UserProfile {
  id: string
  name: string
  email: string
  emailVerified?: boolean
  image?: string | null
  avatarUrl?: string
  createdAt?: string | Date
}

export const ProfilePage: FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(async (res) => {
        if (!res.ok) {
          navigate('/login?redirect=/profile')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
          setNameInput(data.user.name || '')
        }
      })
      .catch(() => {
        navigate('/login?redirect=/profile')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate])

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed) return

    setSaving(true)
    setStatusMsg(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update cadet name')
      }

      if (user) {
        setUser({ ...user, name: trimmed })
      }
      setStatusMsg({ type: 'success', text: '✨ Cadet name updated successfully!' })
      setTimeout(() => setStatusMsg(null), 3000)
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `⚠️ ${err.message || 'Error updating name'}` })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    if (!confirm('Are you sure you want to sign out from Cosmic HQ?')) return
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
    } catch (_e) {
      // Sign out fallback
    }
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="page-wrapper profile-page-wrapper">
        <div className="profile-main-container">
          <div className="profile-card profile-loading-card">
            <div className="profile-spinner"></div>
            <p>Retrieving Cosmic Cadet Dossier...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const email = user.email || 'cadet@neonactivities.com'
  const cadetName = user.name || email.split('@')[0]
  const avatarUrl =
    user.avatarUrl ||
    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`

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
            <Link to="/" className="btn-back-hq" title="Return to Cosmic HQ">
              <span className="back-arrow">←</span>
              <span>Back to HQ</span>
            </Link>
          </div>

          <div className="header-center">
            <Link to="/" className="logo-link" title="Neon Activities">
              <img src="/neon.activities.logo.png" alt="Neon Activities" className="header-logo-img" />
            </Link>
          </div>

          <div className="header-right">
            <button
              type="button"
              className="btn-header-secondary btn-signout"
              title="Sign Out"
              onClick={handleSignOut}
            >
              <Icon icon={Icons.login} size={16} />
              <span>Sign Out</span>
            </button>
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
              <h1 id="profileDisplayName" className="profile-user-name">
                {cadetName}
              </h1>
              <p id="profileDisplayEmail" className="profile-user-email">
                {email}
              </p>
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
                <p className="section-subtitle">
                  Change how your explorer name appears across leaderboards and games.
                </p>
              </div>
            </div>

            <form id="profileEditForm" className="profile-edit-form" onSubmit={handleSaveName}>
              <div className="form-group">
                <label htmlFor="inputCadetName" className="form-label">
                  Cadet / Explorer Name
                </label>
                <div className="input-row-inline">
                  <input
                    id="inputCadetName"
                    name="name"
                    type="text"
                    className="auth-input profile-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter cadet name..."
                    maxLength={50}
                    required
                    disabled={saving}
                  />
                  <button
                    id="btnSaveName"
                    type="submit"
                    className="btn-primary btn-save-name"
                    disabled={saving}
                  >
                    <span>{saving ? 'Saving...' : 'Save Name'}</span>
                    <Icon icon={Icons.sparkles} size={16} />
                  </button>
                </div>
              </div>

              {statusMsg && (
                <div className="auth-status-msg" aria-live="polite">
                  <span className={`status-${statusMsg.type}`}>{statusMsg.text}</span>
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
                <span className="dossier-value code">{user.id ? `${user.id.substring(0, 18)}...` : 'Cadet'}</span>
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
            <Link to="/" className="btn-primary">
              <Icon icon={Icons.rocketLaunch} size={18} />
              <span>Launch Missions</span>
            </Link>
            <button
              type="button"
              className="btn-secondary btn-signout-main"
              onClick={handleSignOut}
            >
              <Icon icon={Icons.login} size={18} />
              <span>Sign Out of HQ</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
