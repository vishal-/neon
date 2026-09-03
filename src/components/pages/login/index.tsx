import { useState, useEffect, type FC, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export const LoginPage: FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'danger' | 'info'
    text: string
  } | null>(null)

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleSendOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) return

    setLoading(true)
    setStatusMsg({ type: 'info', text: `Transmitting cosmic code to ${trimmedEmail}...` })

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code')
      }

      setStep('otp')
      setOtp('')
      setResendCooldown(45)
      setStatusMsg({ type: 'success', text: '✨ Cosmic code dispatched! Check your email inbox.' })
    } catch (err: any) {
      setStatusMsg({
        type: 'danger',
        text: `⚠️ ${err.message || 'Error sending code. Please try again.'}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedOtp = otp.trim()
    if (!trimmedOtp || trimmedOtp.length < 6) return

    setLoading(true)
    setStatusMsg({ type: 'info', text: 'Authenticating galactic access credentials...' })

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: trimmedOtp }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired code. Please verify the code.')
      }

      setStatusMsg({ type: 'success', text: '🚀 Blast off! Credentials verified! Loading mission deck...' })

      setTimeout(() => {
        const redirectUrl = searchParams.get('redirect') || '/'
        navigate(redirectUrl)
      }, 1000)
    } catch (err: any) {
      setStatusMsg({ type: 'danger', text: `⚠️ ${err.message || 'Verification failed. Please retry.'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden bg-dark text-light">
      {/* Top Header */}
      <header className="py-3 px-4 border-bottom border-secondary border-opacity-25">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3">
            <span>&larr;</span>
            <span>Back to HQ</span>
          </Link>

          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src="/neon.activities.logo.png"
              alt="Neon Activities"
              style={{ height: '36px', objectFit: 'contain' }}
            />
          </Link>

          <div>
            <span className="badge rounded-pill text-bg-info d-none d-sm-inline-block">
              🌟 Safe & Passwordless
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Center Card */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
        <div
          className="card shadow-lg border border-secondary bg-dark text-light overflow-hidden"
          style={{ maxWidth: '460px', width: '100%', borderRadius: '1.25rem' }}
        >
          {/* Card Accent Top Bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #0dcaf0, #6610f2, #d63384)' }}></div>

          <div className="card-body p-4 p-sm-5 d-flex flex-column align-items-center">
            {/* Avatar Crest */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border border-2 border-info mb-3 shadow-sm bg-black"
              style={{ width: '74px', height: '74px' }}
            >
              <img src="/logo.png" alt="Neon Activities" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>

            {/* Heading Group */}
            <div className="text-center mb-4">
              <span className="badge rounded-pill text-bg-primary mb-2 px-3 py-1 text-uppercase">
                {step === 'email' ? '🚀 Cadet & Boss Portal' : '🔐 Access Code'}
              </span>
              <h1 className="h3 fw-bold mb-1">
                {step === 'email' ? 'Enter Cosmic Station' : 'Verify Your Identity'}
              </h1>
              <p className="text-muted small mb-0">
                {step === 'email'
                  ? 'Sign in to log quests, track XP streaks, and access Mission Control.'
                  : 'A 6-digit one-time passkey was transmitted to your inbox.'}
              </p>
            </div>

            {/* Status Alert Banner */}
            {statusMsg && (
              <div className={`alert alert-${statusMsg.type} w-100 py-2 px-3 text-center small mb-3`} role="alert">
                {statusMsg.text}
              </div>
            )}

            {/* STEP 1: Email Submission Form */}
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="w-100">
                <div className="mb-3">
                  <label htmlFor="authEmailInput" className="form-label small fw-semibold text-light">
                    Cadet or Parent Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-black border-secondary text-info">
                      <Icon icon={Icons.astronautNoto} size={20} />
                    </span>
                    <input
                      id="authEmailInput"
                      type="email"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="cadet@galaxy.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-text text-muted small">
                    No password needed. We'll send a quick 6-digit passcode.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
                  disabled={loading || !email.trim()}
                >
                  <span>{loading ? 'Transmitting Code...' : 'Send Cosmic Access Code'}</span>
                  <Icon icon={Icons.rocketLaunch} size={18} />
                </button>
              </form>
            ) : (
              /* STEP 2: OTP Passcode Form */
              <form onSubmit={handleVerifyOtp} className="w-100">
                {/* Target Email Strip */}
                <div className="d-flex justify-content-between align-items-center p-2 px-3 rounded bg-black border border-secondary mb-3 w-100">
                  <div className="d-flex flex-column">
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>SENDING TO:</span>
                    <span className="small fw-bold text-info text-truncate" style={{ maxWidth: '240px' }}>{email}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm py-0 px-2"
                    onClick={() => {
                      setStep('email')
                      setStatusMsg(null)
                    }}
                    disabled={loading}
                  >
                    Change
                  </button>
                </div>

                <div className="mb-3">
                  <label htmlFor="authOtpInput" className="form-label small fw-semibold text-light">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="authOtpInput"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    className="form-control form-control-lg bg-black text-info border-info text-center fw-bold fs-2"
                    style={{ letterSpacing: '0.45em' }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    autoComplete="one-time-code"
                    disabled={loading}
                    autoFocus
                  />
                  <div className="form-text text-muted small text-center mt-1">
                    Check your inbox (and spam folder if not received).
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
                  disabled={loading || otp.trim().length < 6}
                >
                  <span>{loading ? 'Authenticating...' : 'Verify & Enter Station'}</span>
                  <Icon icon={Icons.sparkles} size={18} />
                </button>

                <div className="d-flex justify-content-center align-items-center gap-2 small text-muted mb-2">
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-info text-decoration-none p-0"
                    onClick={() => handleSendOtp()}
                    disabled={loading || resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Passcode'}
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                    onClick={() => {
                      setStep('email')
                      setStatusMsg(null)
                    }}
                    disabled={loading}
                  >
                    Use Another Email
                  </button>
                </div>
              </form>
            )}

            {/* Footer Perks */}
            <div className="w-100 pt-3 mt-3 border-top border-secondary border-opacity-25 small text-muted d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <span>⚡</span>
                <span>Instant OTP Access — Zero Passwords</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🛡️</span>
                <span>COPPA Safe & Encrypted Session</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🎖️</span>
                <span>Leaderboard XP & Mission Badges</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center small text-muted border-top border-secondary border-opacity-25">
        <span>© {new Date().getFullYear()} Neon Activities • Cosmic Brain Quest HQ</span>
      </footer>
    </div>
  )
}
