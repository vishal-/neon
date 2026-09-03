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
  totalXp?: number
  level?: number
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
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4 text-center">
        <div className="spinner-border text-info mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold">Retrieving Cosmic Cadet Dossier...</h4>
        <p className="text-muted small">Accessing registered explorer profile</p>
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
    <div className="min-vh-100 bg-dark text-light d-flex flex-column">
      {/* Top Header for Profile */}
      <header className="py-3 px-4 border-bottom border-secondary border-opacity-25 bg-black bg-opacity-40">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3" title="Return to Cosmic HQ">
            <span>&larr;</span>
            <span>Back to HQ</span>
          </Link>

          <Link to="/" className="d-flex align-items-center text-decoration-none" title="Neon Activities">
            <img src="/neon.activities.logo.png" alt="Neon Activities" style={{ height: '36px', objectFit: 'contain' }} />
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
            title="Sign Out"
            onClick={handleSignOut}
          >
            <Icon icon={Icons.login} size={16} />
            <span className="d-none d-sm-inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Profile Dossier Container */}
      <main className="flex-grow-1 container py-4 px-3 d-flex justify-content-center">
        <div
          className="card shadow-lg border border-secondary bg-dark text-light overflow-hidden w-100"
          style={{ maxWidth: '780px', borderRadius: '1.25rem' }}
        >
          {/* Card Top Accent Bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #0dcaf0, #6610f2, #d63384)' }}></div>

          <div className="card-body p-4 p-md-5">
            {/* Avatar & Header Section */}
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4 pb-4 border-bottom border-secondary border-opacity-25 text-center text-sm-start">
              <div
                className="position-relative d-flex align-items-center justify-content-center rounded-circle border border-3 border-info shadow bg-black"
                style={{ width: '96px', height: '96px', flexShrink: 0 }}
              >
                <img
                  id="profileAvatarImg"
                  src={avatarUrl}
                  alt={`${cadetName}'s Fun Emoji Avatar`}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>


              <div className="flex-grow-1">
                <h1 id="profileDisplayName" className="h3 fw-bold mb-1">
                  {cadetName}
                </h1>
                <p id="profileDisplayEmail" className="text-muted small mb-0">
                  {email}
                </p>
              </div>
            </div>

            {/* EDIT NAME SECTION */}
            <div className="card bg-black bg-opacity-25 border border-secondary border-opacity-50 mb-4 p-3 p-sm-4 rounded-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="text-info">
                  <Icon icon={Icons.profile} size={20} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-0">Edit Cadet Name</h3>
                  <p className="text-muted small mb-0">
                    Change how your explorer name appears across leaderboards and games.
                  </p>
                </div>
              </div>

              <form id="profileEditForm" onSubmit={handleSaveName}>
                <div className="mb-2">
                  <label htmlFor="inputCadetName" className="form-label small fw-semibold text-light">
                    Cadet / Explorer Name
                  </label>
                  <div className="input-group">
                    <input
                      id="inputCadetName"
                      name="name"
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
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
                      className="btn btn-info text-dark fw-bold d-inline-flex align-items-center gap-1"
                      disabled={saving}
                    >
                      <span>{saving ? 'Saving...' : 'Save Name'}</span>
                      <Icon icon={Icons.sparkles} size={16} />
                    </button>
                  </div>
                </div>

                {statusMsg && (
                  <div className={`alert alert-${statusMsg.type === 'success' ? 'success' : 'danger'} py-2 px-3 small mt-2 mb-0`} role="alert">
                    {statusMsg.text}
                  </div>
                )}
              </form>
            </div>

            {/* SAVED MISSION & ACCOUNT INFORMATION */}
            <div className="card bg-black bg-opacity-25 border border-secondary border-opacity-50 mb-4 p-3 p-sm-4 rounded-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="text-warning">
                  <Icon icon={Icons.shieldCheck} size={20} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-0">Saved Cosmic Dossier</h3>
                  <p className="text-muted small mb-0">Your saved explorer progress, credentials, and security overview.</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Email Address</div>
                    <div className="text-info text-break fw-semibold">{email}</div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Member Since</div>
                    <div className="text-light fw-semibold">{memberSince}</div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Total Cosmic XP</div>
                    <span className="badge text-bg-warning fw-bold fs-6">✨ {user.totalXp ?? 0} XP (Level {user.level ?? 1})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS ROW */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2">
              <Link to="/" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold">
                <Icon icon={Icons.rocketLaunch} size={18} />
                <span>Launch Missions</span>
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger d-inline-flex align-items-center gap-2 px-4 py-2"
                onClick={handleSignOut}
              >
                <Icon icon={Icons.login} size={18} />
                <span>Sign Out of HQ</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
