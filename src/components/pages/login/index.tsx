import { useState, type FC, type FormEvent } from 'react'
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
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'loading'; text: string } | null>(null)

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) return

    setLoading(true)
    setStatusMsg({ type: 'loading', text: `Sending cosmic code to ${trimmedEmail}...` })

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
      setStatusMsg({ type: 'success', text: '✨ Cosmic code sent! Please check your inbox.' })
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `⚠️ ${err.message || 'Error sending code. Please try again.'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedOtp = otp.trim()
    if (!trimmedOtp || trimmedOtp.length < 6) return

    setLoading(true)
    setStatusMsg({ type: 'loading', text: 'Verifying cosmic code...' })

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: trimmedOtp }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired code. Please try again.')
      }

      setStatusMsg({ type: 'success', text: '🎉 Blast off! Signed in successfully! Redirecting...' })

      setTimeout(() => {
        const redirectUrl = searchParams.get('redirect') || '/'
        navigate(redirectUrl)
      }, 1000)
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `⚠️ ${err.message || 'Verification failed'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper login-page-wrapper">
      {/* Background Starfield Canvas and Ambient Nebulas */}
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Minimal Top Header for Login Page */}
      <header className="site-header login-header">
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
            {/* Header Right spacer */}
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="login-main-container">
        <div className="login-card">
          {/* Logo & Header */}
          <div className="login-logo-wrapper">
            <div className="login-icon-glow"></div>
            <img src="/logo.png" alt="Neon Activities Logo" className="login-app-logo" />
          </div>

          <h1 className="login-title">Cadet HQ Access</h1>
          <p className="login-subtitle">
            Enter your email to receive a cosmic login code. No passwords required!
          </p>

          {/* STEP 1: Enter Email Form */}
          {step === 'email' ? (
            <form id="authEmailForm" className="auth-form" onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="authEmailInput" className="form-label">
                  Parent or Cadet Email
                </label>
                <div className="input-wrapper">
                  <div className="input-icon-left">
                    <Icon icon={Icons.rocketLaunch} size={18} />
                  </div>
                  <input
                    id="authEmailInput"
                    type="email"
                    className="auth-input"
                    placeholder="explorer@galaxy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <button id="btnSendOtp" type="submit" className="btn-primary full-width" disabled={loading}>
                <span>{loading ? 'Sending Code...' : 'Send Cosmic Code'}</span>
                <Icon icon={Icons.sparkles} size={18} />
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP Form */
            <form id="authOtpForm" className="auth-form" onSubmit={handleVerifyOtp}>
              <div className="otp-intro">
                <p>We sent a 6-digit verification code to:</p>
                <strong id="authTargetEmail" className="target-email">
                  {email}
                </strong>
              </div>

              <div className="form-group">
                <label htmlFor="authOtpInput" className="form-label">
                  6-Digit Access Code
                </label>
                <div className="input-wrapper">
                  <div className="input-icon-left">
                    <Icon icon={Icons.sparkles} size={18} />
                  </div>
                  <input
                    id="authOtpInput"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    className="auth-input otp-input"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoComplete="one-time-code"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <button id="btnVerifyOtp" type="submit" className="btn-primary full-width" disabled={loading}>
                <span>{loading ? 'Verifying...' : 'Verify & Blast Off'}</span>
                <Icon icon={Icons.sparkles} size={18} />
              </button>

              <div className="otp-extra-actions">
                <button
                  type="button"
                  className="btn-link"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend Code
                </button>
                <span className="dot-sep">•</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    setStep('email')
                    setStatusMsg(null)
                  }}
                  disabled={loading}
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {/* Status Messages */}
          {statusMsg && (
            <div id="authStatusMsg" className="auth-status-msg" aria-live="polite">
              <span className={`status-${statusMsg.type}`}>{statusMsg.text}</span>
            </div>
          )}

          {/* Safety Footnote */}
          <div className="login-safety-badge">
            <Icon icon={Icons.shieldCheck} size={16} color="var(--neon-green)" />
            <span>COPPA-compliant, passwordless security. No passwords stored.</span>
          </div>
        </div>
      </main>
    </div>
  )
}

