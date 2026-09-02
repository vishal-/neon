import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export const ProfilePage: FC = () => {
  return (
    <div className="page-wrapper profile-page-wrapper">
      {/* Background Starfield Canvas and Ambient Nebulas */}
      <canvas id="starfield"></canvas>
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
            <button 
              id="headerSignOutBtn" 
              className="btn-header-secondary btn-signout" 
              onclick="window.handleSignOut();"
              style={{ display: 'none' }}
              title="Sign Out"
            >
              <Icon icon={Icons.login} size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Dossier Container */}
      <main className="profile-main-container">
        {/* Loading State */}
        <div id="profileLoadingCard" className="profile-card profile-loading-card">
          <div className="profile-spinner"></div>
          <p>Retrieving Cosmic Cadet Dossier...</p>
        </div>

        {/* Unauthorized / Not Signed In State */}
        <div id="profileGuestCard" className="profile-card profile-guest-card" style={{ display: 'none' }}>
          <div className="guest-avatar-wrapper">
            <Icon icon={Icons.astronautNoto} size={54} />
          </div>
          <h2 className="profile-card-title">Cadet Login Required</h2>
          <p className="profile-card-subtitle">
            You must be logged in to view your cadet profile, saved statistics, and update your explorer name.
          </p>
          <div className="profile-action-row">
            <a href="/login?redirect=/profile" className="btn-primary full-width">
              <span>Sign In with Email</span>
              <Icon icon={Icons.rocketLaunch} size={18} />
            </a>
            <a href="/" className="btn-secondary full-width">
              <span>Return to Cosmic HQ</span>
            </a>
          </div>
        </div>

        {/* Authenticated Profile Dossier Card */}
        <div id="profileAuthCard" className="profile-card profile-auth-card" style={{ display: 'none' }}>
          {/* Avatar & Header Section */}
          <div className="profile-top-section">
            <div className="profile-avatar-container">
              <div className="avatar-ring-glow"></div>
              <img 
                id="profileAvatarImg" 
                src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=cosmic-explorer" 
                alt="Cadet Fun Emoji Avatar" 
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
              <h1 id="profileDisplayName" className="profile-user-name">Cadet Explorer</h1>
              <p id="profileDisplayEmail" className="profile-user-email">explorer@neonactivities.com</p>
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

            <form id="profileEditForm" className="profile-edit-form" onsubmit="window.handleSaveProfile(event);">
              <div className="form-group">
                <label htmlFor="inputCadetName" className="form-label">Cadet / Explorer Name</label>
                <div className="input-row-inline">
                  <input 
                    id="inputCadetName" 
                    type="text" 
                    className="auth-input profile-input" 
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
              <div id="profileStatusMsg" className="auth-status-msg" aria-live="polite"></div>
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
                <span id="dossierEmail" className="dossier-value highlight">Loading...</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">CADET ID</span>
                <span id="dossierUserId" className="dossier-value code">Loading...</span>
              </div>

              <div className="dossier-item">
                <span className="dossier-label">MEMBER SINCE</span>
                <span id="dossierCreatedAt" className="dossier-value">Today</span>
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
            <button type="button" className="btn-secondary btn-signout-main" onclick="window.handleSignOut();">
              <Icon icon={Icons.login} size={18} />
              <span>Sign Out of HQ</span>
            </button>
          </div>
        </div>
      </main>

      {/* Client-side Profile Data Fetching & Updation */}
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
              const numStars = 85;

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
            // Profile Data Loading & Session Management
            // ==========================================
            let currentUser = null;

            function getDicebearAvatarUrl(email) {
              const seed = (email || 'cosmic-explorer').trim().toLowerCase();
              return 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=' + encodeURIComponent(seed);
            }

            async function loadProfile() {
              const loadingCard = document.getElementById('profileLoadingCard');
              const guestCard = document.getElementById('profileGuestCard');
              const authCard = document.getElementById('profileAuthCard');
              const headerSignOutBtn = document.getElementById('headerSignOutBtn');

              try {
                const res = await fetch('/api/auth/get-session');
                if (!res.ok) throw new Error('Not authenticated');

                const data = await res.json();
                if (!data || !data.user || !data.user.email) {
                  throw new Error('No active session');
                }

                currentUser = data.user;

                // Populate user profile info
                const email = currentUser.email;
                const name = currentUser.name || email.split('@')[0];
                const avatarUrl = getDicebearAvatarUrl(email);

                const avatarImg = document.getElementById('profileAvatarImg');
                const displayName = document.getElementById('profileDisplayName');
                const displayEmail = document.getElementById('profileDisplayEmail');
                const inputCadetName = document.getElementById('inputCadetName');
                const dossierEmail = document.getElementById('dossierEmail');
                const dossierUserId = document.getElementById('dossierUserId');
                const dossierCreatedAt = document.getElementById('dossierCreatedAt');

                if (avatarImg) avatarImg.src = avatarUrl;
                if (displayName) displayName.textContent = name;
                if (displayEmail) displayEmail.textContent = email;
                if (inputCadetName) inputCadetName.value = name;
                if (dossierEmail) dossierEmail.textContent = email;
                if (dossierUserId) dossierUserId.textContent = currentUser.id ? currentUser.id.substring(0, 18) + '...' : 'CADET-01';

                if (currentUser.createdAt) {
                  try {
                    const date = new Date(currentUser.createdAt);
                    if (dossierCreatedAt) dossierCreatedAt.textContent = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                  } catch (e) {}
                }

                if (loadingCard) loadingCard.style.display = 'none';
                if (guestCard) guestCard.style.display = 'none';
                if (authCard) authCard.style.display = 'flex';
                if (headerSignOutBtn) headerSignOutBtn.style.display = 'inline-flex';

              } catch (err) {
                if (loadingCard) loadingCard.style.display = 'none';
                if (authCard) authCard.style.display = 'none';
                if (guestCard) guestCard.style.display = 'flex';
                if (headerSignOutBtn) headerSignOutBtn.style.display = 'none';
              }
            }

            window.handleSaveProfile = async function(e) {
              e.preventDefault();
              const inputCadetName = document.getElementById('inputCadetName');
              const btn = document.getElementById('btnSaveName');
              const statusMsg = document.getElementById('profileStatusMsg');
              if (!inputCadetName || !currentUser) return;

              const newName = inputCadetName.value.trim();
              if (!newName) return;

              if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span>Saving...</span> 🚀';
              }
              if (statusMsg) statusMsg.innerHTML = '<span class="status-loading">Updating cadet name...</span>';

              try {
                const res = await fetch('/api/auth/update-user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newName })
                });

                if (!res.ok) {
                  const errData = await res.json().catch(function() { return {}; });
                  throw new Error(errData.message || 'Failed to update name');
                }

                currentUser.name = newName;
                const displayName = document.getElementById('profileDisplayName');
                if (displayName) displayName.textContent = newName;

                if (statusMsg) statusMsg.innerHTML = '<span class="status-success">✨ Cadet name updated successfully!</span>';
                playSynthSound('correct');

                setTimeout(function() {
                  if (statusMsg) statusMsg.innerHTML = '';
                }, 3500);

              } catch (err) {
                if (statusMsg) statusMsg.innerHTML = '<span class="status-error">⚠️ ' + (err.message || 'Error updating name') + '</span>';
                playSynthSound('wrong');
              } finally {
                if (btn) {
                  btn.disabled = false;
                  btn.innerHTML = '<span>Save Name</span> ✨';
                }
              }
            };

            window.handleSignOut = async function() {
              if (!confirm('Are you sure you want to sign out from Cosmic HQ?')) return;

              try {
                await fetch('/api/auth/sign-out', { method: 'POST' });
              } catch (e) {}

              playSynthSound('flip');
              window.location.href = '/login';
            };

            loadProfile();
          })();
        </script>
      `)}
    </div>
  )
}

