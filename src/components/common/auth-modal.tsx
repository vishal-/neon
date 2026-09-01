import type { FC } from 'hono/jsx'
import { Icon } from '../ui/icon'
import { Icons } from '../ui/icons'

export const AuthModal: FC = () => {
  return (
    <>
      {/* Auth Modal Backdrop */}
      <div 
        id="authModalBackdrop" 
        className="auth-modal-backdrop" 
        onclick="window.closeAuthModal();"
        aria-hidden="true"
      ></div>

      {/* Auth Modal Card */}
      <div id="authModal" className="auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        {/* Close Button */}
        <button 
          className="btn-auth-modal-close" 
          onclick="window.closeAuthModal();" 
          aria-label="Close Modal"
        >
          <Icon icon={Icons.close} size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-icon">
            <Icon icon={Icons.rocketLaunch} size={28} color="#7ee7c9" />
          </div>
          <h3 id="authModalTitle" className="auth-modal-title">Explorer Login</h3>
          <p className="auth-modal-subtitle">Passwordless email login with one-time verification code.</p>
        </div>

        {/* STEP 1: Email Form */}
        <form id="authEmailForm" className="auth-step-form" onsubmit="window.handleSendOtp(event);">
          <div className="form-group">
            <label htmlFor="authEmailInput" className="form-label">Parent or Cadet Email</label>
            <input 
              id="authEmailInput" 
              type="email" 
              className="auth-input" 
              placeholder="e.g. explorer@example.com" 
              required 
              autocomplete="email"
            />
          </div>

          <button id="btnSendOtp" type="submit" className="btn-primary full-width">
            <span>Send Cosmic Code</span>
            <Icon icon={Icons.rocketLaunch} size={18} />
          </button>
        </form>

        {/* STEP 2: OTP Verification Form */}
        <form id="authOtpForm" className="auth-step-form" style={{ display: 'none' }} onsubmit="window.handleVerifyOtp(event);">
          <div className="otp-sent-banner">
            <span>Code sent to <strong id="authTargetEmail">email</strong></span>
            <button type="button" className="btn-change-email" onclick="window.backToEmailStep();">Change</button>
          </div>

          <div className="form-group">
            <label htmlFor="authOtpInput" className="form-label">6-Digit One-Time Code</label>
            <input 
              id="authOtpInput" 
              type="text" 
              className="auth-input otp-code-input" 
              placeholder="123456" 
              maxLength={6} 
              pattern="[0-9]{6}" 
              required 
              autocomplete="one-time-code"
            />
          </div>

          <button id="btnVerifyOtp" type="submit" className="btn-primary full-width">
            <span>Verify & Blast Off</span>
            <Icon icon={Icons.sparkles} size={18} />
          </button>

          <div className="resend-row">
            <span>Didn't receive the code?</span>
            <button type="button" className="btn-resend" onclick="window.handleResendOtp();">Resend Code</button>
          </div>
        </form>

        {/* Status Messages */}
        <div id="authStatusMsg" className="auth-status-msg"></div>
      </div>
    </>
  )
}
