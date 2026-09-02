import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export const LoginPage: FC = () => {
  return (
    <div className="page-wrapper login-page-wrapper">
      {/* Background Starfield Canvas and Ambient Nebulas */}
      <canvas id="starfield"></canvas>
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Minimal Top Header for Login Page */}
      <header className="site-header login-header">
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
            <a href="/" className="btn-header-secondary" title="Explore Games">
              <Icon icon={Icons.rocketLaunch} size={16} />
              <span>Explore</span>
            </a>
          </div>
        </div>
      </header>

      {/* Central Login Card Container */}
      <main className="login-main-container">
        <div className="login-card">
          {/* Main App Original Logo */}
          <div className="login-hero-logo-wrapper">
            <div className="login-logo-glow"></div>
            <img src="/logo.png" alt="Neon Activities Logo" className="login-hero-logo" />
          </div>

          {/* Header Texts */}
          <div className="login-card-header">
            <h1 className="login-card-title">Cosmic Cadet Login</h1>
            <p className="login-card-subtitle">
              Passwordless email sign-in with a one-time verification code. Safe, fast, and secure for kids & parents!
            </p>
          </div>

          {/* STEP 1: Email Form */}
          <form id="authEmailForm" className="auth-step-form" onsubmit="window.handleSendOtp(event);">
            <div className="form-group">
              <label htmlFor="authEmailInput" className="form-label">Cadet or Parent Email</label>
              <div className="input-with-icon">
                <input 
                  id="authEmailInput" 
                  type="email" 
                  className="auth-input" 
                  placeholder="e.g. cadet@neonactivities.com" 
                  required 
                  autocomplete="email"
                  autofocus
                />
              </div>
            </div>

            <button id="btnSendOtp" type="submit" className="btn-primary full-width btn-login-action">
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
              <label htmlFor="authOtpInput" className="form-label">6-Digit Verification Code</label>
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

            <button id="btnVerifyOtp" type="submit" className="btn-primary full-width btn-login-action">
              <span>Verify & Blast Off</span>
              <Icon icon={Icons.sparkles} size={18} />
            </button>

            <div className="resend-row">
              <span>Didn't receive the code?</span>
              <button type="button" className="btn-resend" onclick="window.handleResendOtp();">Resend Code</button>
            </div>
          </form>

          {/* Status Messages */}
          <div id="authStatusMsg" className="auth-status-msg" aria-live="polite"></div>

          {/* Safety Footnote */}
          <div className="login-safety-badge">
            <Icon icon={Icons.shieldCheck} size={16} color="var(--neon-green)" />
            <span>COPPA-compliant, passwordless security. No passwords stored.</span>
          </div>
        </div>
      </main>

      {/* Client-side Starfield and Authentication Logic */}
      {raw(`
        <script>
          (function() {
            // ==========================================
            // Audio Web Audio API Sound Generator
            // ==========================================
            let audioCtx = null;
            function getAudioContext() {
              if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
              }
              if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
              }
              return audioCtx;
            }

            function playSynthSound(type) {
              try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                if (type === 'correct') {
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(587.33, now);
                  osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                  gain.gain.setValueAtTime(0.18, now);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                  osc.start(now);
                  osc.stop(now + 0.35);
                } else if (type === 'chest') {
                  osc.type = 'triangle';
                  osc.frequency.setValueAtTime(440, now);
                  osc.frequency.setValueAtTime(554.37, now + 0.1);
                  osc.frequency.setValueAtTime(659.25, now + 0.2);
                  osc.frequency.setValueAtTime(880, now + 0.3);
                  gain.gain.setValueAtTime(0.2, now);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                  osc.start(now);
                  osc.stop(now + 0.6);
                } else if (type === 'wrong') {
                  osc.type = 'sawtooth';
                  osc.frequency.setValueAtTime(220, now);
                  osc.frequency.linearRampToValueAtTime(110, now + 0.25);
                  gain.gain.setValueAtTime(0.15, now);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                  osc.start(now);
                  osc.stop(now + 0.25);
                }
              } catch (e) {}
            }

            // ==========================================
            // Starfield Animation
            // ==========================================
            const canvas = document.getElementById('starfield');
            if (canvas) {
              const ctx = canvas.getContext('2d');
              let stars = [];
              const numStars = 90;

              function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initStars();
              }

              function initStars() {
                stars = [];
                for (let i = 0; i < numStars; i++) {
                  stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.4,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.25 + 0.05,
                    color: ['#ffffff', '#7ee7c9', '#bf8efd', '#facc15'][Math.floor(Math.random() * 4)]
                  });
                }
              }

              function renderStars() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < stars.length; i++) {
                  const s = stars[i];
                  s.y += s.speed;
                  if (s.y > canvas.height) s.y = 0;
                  ctx.beginPath();
                  ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                  ctx.fillStyle = s.color;
                  ctx.globalAlpha = s.alpha;
                  ctx.fill();
                }
                requestAnimationFrame(renderStars);
              }

              window.addEventListener('resize', resizeCanvas);
              resizeCanvas();
              renderStars();
            }

            // ==========================================
            // Better Auth Email OTP Flow
            // ==========================================
            let authCurrentEmail = '';

            window.backToEmailStep = function() {
              const emailForm = document.getElementById('authEmailForm');
              const otpForm = document.getElementById('authOtpForm');
              const statusMsg = document.getElementById('authStatusMsg');
              if (emailForm) emailForm.style.display = 'flex';
              if (otpForm) otpForm.style.display = 'none';
              if (statusMsg) statusMsg.innerHTML = '';
              const emailInput = document.getElementById('authEmailInput');
              if (emailInput) emailInput.focus();
            };

            window.handleSendOtp = async function(e) {
              e.preventDefault();
              const emailInput = document.getElementById('authEmailInput');
              const btn = document.getElementById('btnSendOtp');
              const statusMsg = document.getElementById('authStatusMsg');
              if (!emailInput) return;

              const email = emailInput.value.trim();
              if (!email) return;

              authCurrentEmail = email;
              if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span>Sending Code...</span> 🚀';
              }
              if (statusMsg) statusMsg.innerHTML = '<span class="status-loading">Sending cosmic code to ' + email + '...</span>';

              try {
                const res = await fetch('/api/auth/email-otp/send-verification-otp', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: email, type: 'sign-in' })
                });

                if (!res.ok) {
                  const data = await res.json().catch(function() { return {}; });
                  throw new Error(data.message || 'Failed to send OTP code');
                }

                // Show Step 2
                const emailForm = document.getElementById('authEmailForm');
                const otpForm = document.getElementById('authOtpForm');
                const targetEmailEl = document.getElementById('authTargetEmail');

                if (emailForm) emailForm.style.display = 'none';
                if (otpForm) otpForm.style.display = 'flex';
                if (targetEmailEl) targetEmailEl.textContent = email;
                if (statusMsg) statusMsg.innerHTML = '<span class="status-success">✨ Cosmic code sent! Please check your inbox.</span>';

                const otpInput = document.getElementById('authOtpInput');
                if (otpInput) {
                  otpInput.value = '';
                  otpInput.focus();
                }
                playSynthSound('correct');
              } catch (err) {
                if (statusMsg) statusMsg.innerHTML = '<span class="status-error">⚠️ ' + (err.message || 'Error sending code. Please try again.') + '</span>';
                playSynthSound('wrong');
              } finally {
                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = '<span>Send Cosmic Code</span> 🚀';
                }
              }
            };

            window.handleVerifyOtp = async function(e) {
              e.preventDefault();
              const otpInput = document.getElementById('authOtpInput');
              const btn = document.getElementById('btnVerifyOtp');
              const statusMsg = document.getElementById('authStatusMsg');
              if (!otpInput || !authCurrentEmail) return;

              const otp = otpInput.value.trim();
              if (!otp || otp.length < 6) return;

              if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span>Verifying...</span> ✨';
              }
              if (statusMsg) statusMsg.innerHTML = '<span class="status-loading">Verifying code...</span>';

              try {
                const res = await fetch('/api/auth/sign-in/email-otp', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: authCurrentEmail, otp: otp })
                });

                if (!res.ok) {
                  const data = await res.json().catch(function() { return {}; });
                  throw new Error(data.message || 'Invalid or expired code. Please try again.');
                }

                if (statusMsg) statusMsg.innerHTML = '<span class="status-success">🎉 Blast off! Signed in successfully! Redirecting to HQ...</span>';
                playSynthSound('chest');

                setTimeout(function() {
                  const urlParams = new URLSearchParams(window.location.search);
                  const redirectUrl = urlParams.get('redirect') || '/';
                  window.location.href = redirectUrl;
                }, 1200);
              } catch (err) {
                if (statusMsg) statusMsg.innerHTML = '<span class="status-error">⚠️ ' + (err.message || 'Verification failed') + '</span>';
                playSynthSound('wrong');
              } finally {
                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = '<span>Verify & Blast Off</span> ✨';
                }
              }
            };

            window.handleResendOtp = function() {
              if (!authCurrentEmail) return;
              const emailInput = document.getElementById('authEmailInput');
              if (emailInput) emailInput.value = authCurrentEmail;
              window.handleSendOtp(new Event('submit'));
            };
          })();
        </script>
      `)}
    </div>
  )
}

