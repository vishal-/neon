import { useState, useEffect, type FC, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Chip, Input } from '@heroui/react'
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
    type: 'success' | 'error' | 'loading'
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
    setStatusMsg({ type: 'loading', text: `Transmitting cosmic code to ${trimmedEmail}...` })

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
      setResendCooldown(45) // 45s cooldown
      setStatusMsg({ type: 'success', text: '✨ Cosmic code dispatched! Check your email inbox.' })
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
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
    setStatusMsg({ type: 'loading', text: 'Authenticating galactic access credentials...' })

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
      setStatusMsg({ type: 'error', text: `⚠️ ${err.message || 'Verification failed. Please retry.'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-cosmic-viewport">
      {/* Background Animated Nebulas & Starry Atmosphere */}
      <div className="login-nebula nebula-top-left"></div>
      <div className="login-nebula nebula-bottom-right"></div>
      <div className="login-nebula nebula-center"></div>

      {/* Top Header */}
      <header className="login-nav-header">
        <div className="login-nav-inner">
          <Link to="/" className="login-back-btn">
            <span className="back-arrow">&larr;</span>
            <span>Back to HQ</span>
          </Link>

          <Link to="/" className="login-nav-brand">
            <img
              src="/neon.activities.logo.png"
              alt="Neon Activities"
              className="login-header-logo"
            />
          </Link>

          <div className="login-nav-badge">
            <Chip size="sm" variant="soft" className="chip-cyan">
              🌟 Safe & Passwordless
            </Chip>
          </div>
        </div>
      </header>

      {/* Main Login Center Card */}
      <main className="login-card-container">
        <Card className="login-hero-card">
          {/* Card Accent Glow Bar */}
          <div className="card-top-accent"></div>

          {/* Central Logo & Orbital Ring */}
          <div className="login-avatar-stage">
            <div className="avatar-orbital-ring"></div>
            <div className="avatar-orbital-pulse"></div>
            <div className="login-brand-avatar">
              <img src="/logo.png" alt="Neon Activities" className="brand-avatar-img" />
            </div>
          </div>

          <div className="login-heading-group">
            <Chip size="sm" variant="soft" className="chip-purple stage-chip">
              {step === 'email' ? '🚀 CADET & BOSS PORTAL' : '🔐 ENTER ACCESS CODE'}
            </Chip>
            <h1 className="login-main-title">
              {step === 'email' ? 'Enter the Cosmic Station' : 'Verify Your Identity'}
            </h1>
            <p className="login-description">
              {step === 'email'
                ? 'Sign in to log mission quests, preserve your XP streaks, and access Commander Boss tools.'
                : 'A 6-digit one-time passkey was transmitted to your inbox.'}
            </p>
          </div>

          {/* Status Alert Banner */}
          {statusMsg && (
            <div className={`login-status-banner status-${statusMsg.type}`}>
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* STEP 1: Email Submission Form */}
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="login-form-body">
              <div className="login-input-group">
                <label htmlFor="authEmailInput" className="login-input-label">
                  Cadet or Parent Email Address
                </label>
                <div className="login-input-box">
                  <div className="input-affix-icon">
                    <Icon icon={Icons.astronautNoto} size={22} />
                  </div>
                  <Input
                    id="authEmailInput"
                    type="email"
                    placeholder="cadet@galaxy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="login-styled-input"
                  />
                </div>
                <span className="login-input-hint">
                  No password needed. We'll send a quick 6-digit passcode.
                </span>
              </div>

              <Button
                type="submit"
                className="login-btn-blast"
                isDisabled={loading || !email.trim()}
              >
                <span>{loading ? 'Transmitting Code...' : 'Send Cosmic Access Code'}</span>
                <Icon icon={Icons.rocketLaunch} size={18} />
              </Button>
            </form>
          ) : (
            /* STEP 2: OTP Passcode Form */
            <form onSubmit={handleVerifyOtp} className="login-form-body">
              {/* Target Email Banner with Edit Action */}
              <div className="target-email-strip">
                <div className="strip-info">
                  <span className="strip-sub">Sending to:</span>
                  <span className="strip-email">{email}</span>
                </div>
                <button
                  type="button"
                  className="btn-strip-edit"
                  onClick={() => {
                    setStep('email')
                    setStatusMsg(null)
                  }}
                  disabled={loading}
                >
                  Change
                </button>
              </div>

              <div className="login-input-group">
                <label htmlFor="authOtpInput" className="login-input-label">
                  6-Digit Verification Code
                </label>
                <div className="otp-digit-wrapper">
                  <Input
                    id="authOtpInput"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    autoComplete="one-time-code"
                    disabled={loading}
                    autoFocus
                    className="login-styled-input otp-large-input"
                  />
                </div>
                <span className="login-input-hint">
                  Check your inbox (and spam folder if not received).
                </span>
              </div>

              <Button
                type="submit"
                className="login-btn-blast"
                isDisabled={loading || otp.trim().length < 6}
              >
                <span>{loading ? 'Authenticating...' : 'Verify & Enter Station'}</span>
                <Icon icon={Icons.sparkles} size={18} />
              </Button>

              <div className="otp-secondary-actions">
                <button
                  type="button"
                  className="login-resend-link"
                  onClick={() => handleSendOtp()}
                  disabled={loading || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Resend Passcode'}
                </button>
                <span className="dot-divider">•</span>
                <button
                  type="button"
                  className="login-resend-link"
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

          {/* Footer Perks & Trust Badges */}
          <div className="login-card-perks">
            <div className="perk-item">
              <span className="perk-icon">⚡</span>
              <span>Instant OTP Access</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon">🛡️</span>
              <span>COPPA Safe & Zero Passwords</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon">🎖️</span>
              <span>Leaderboard XP Sync</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer copyright */}
      <footer className="login-footer-bar">
        <span>© {new Date().getFullYear()} Neon Activities • Cosmic Brain Quest HQ</span>
      </footer>
    </div>
  )
}
