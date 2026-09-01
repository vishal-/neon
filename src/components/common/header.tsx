import type { FC } from 'hono/jsx'
import { Icon } from '../ui/icon'
import { Icons } from '../ui/icons'

export interface HeaderProps {
  title?: string
}

export const Header: FC<HeaderProps> = () => {
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
              onclick="window.openDrawer();"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* MIDDLE: App Logo */}
          <div className="header-center">
            <a href="#" className="logo-link" onclick="window.switchMainTab('hq'); return false;">
              <img src="/logo.png" alt="Neon Activities Logo" className="header-logo-img" />
              <span className="logo-title">NEON <span>ACTIVITIES</span></span>
            </a>
          </div>

          {/* RIGHT: Login & User Info */}
          <div className="header-right">
            {/* Cadet User Profile / Login Button */}
            <div 
              className="header-user-badge" 
              title="Explorer Cadet Profile" 
              onclick="window.switchMainTab('hq');"
            >
              <div className="user-avatar-mini">
                <Icon icon={Icons.astronautNoto} size={22} />
              </div>
              <div className="user-info-text">
                <span className="user-name-mini">Alex 🧑‍🚀</span>
                <span className="user-level-mini">Lvl 1</span>
              </div>
            </div>

            <a 
              href="#download" 
              className="btn-header-cta" 
              onclick="window.switchMainTab('parents');"
            >
              <Icon icon={Icons.sparkles} size={15} />
              <span>Get App</span>
            </a>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer & Backdrop */}
      <div 
        id="drawerBackdrop" 
        className="drawer-backdrop" 
        onclick="window.closeDrawer();"
        aria-hidden="true"
      ></div>

      <aside id="navDrawer" className="nav-drawer" aria-label="Side Navigation Drawer">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <img src="/logo.png" alt="Neon Activities Logo" className="drawer-logo-img" />
            <span className="logo-title">NEON <span>ACTIVITIES</span></span>
          </div>

          <button 
            className="btn-drawer-close" 
            onclick="window.closeDrawer();" 
            aria-label="Close Navigation Menu"
            title="Close Menu"
          >
            <Icon icon={Icons.close} size={20} />
          </button>
        </div>

        {/* Drawer Cadet Profile Info Card */}
        <div className="drawer-profile-box">
          <div className="drawer-profile-top">
            <div className="avatar-ring-sm">
              <Icon icon={Icons.astronautNoto} size={28} />
            </div>
            <div>
              <div className="drawer-cadet-name">Cadet Alex 🧑‍🚀</div>
              <div className="drawer-cadet-rank">Level 1 • 350 / 500 XP</div>
            </div>
          </div>
          <div className="drawer-streak-pill">
            <span>🔥 7 Day Streak</span>
            <span style={{ color: 'var(--neon-gold)' }}>★ Silver Rank</span>
          </div>
        </div>

        {/* Drawer Navigation List */}
        <nav className="drawer-nav">
          <div className="drawer-nav-section-title">MISSION ARENAS</div>
          <ul className="drawer-links">
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('hq'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-cyan">
                  <Icon icon={Icons.rocketLaunch} size={18} />
                </div>
                <span>HQ & Daily Quests</span>
                <span className="drawer-badge badge-cyan">Active</span>
              </button>
            </li>
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('games'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-pink">
                  <Icon icon={Icons.gamepad} size={18} />
                </div>
                <span>4 Core Game Arenas</span>
                <span className="drawer-badge badge-pink">4 Games</span>
              </button>
            </li>
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('journey'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-gold">
                  <Icon icon={Icons.star} size={18} />
                </div>
                <span>Constellation Journey</span>
                <span className="drawer-badge badge-gold">Map</span>
              </button>
            </li>
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('inclusive'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-purple">
                  <Icon icon={Icons.inclusiveHands} size={18} />
                </div>
                <span>Inclusive & Sensory Play</span>
              </button>
            </li>
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('parents'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-green">
                  <Icon icon={Icons.shieldCheck} size={18} />
                </div>
                <span>Parent Hub & Safety</span>
                <span className="drawer-badge badge-green">COPPA</span>
              </button>
            </li>
          </ul>

          <div className="drawer-nav-section-title">QUICK ACTIONS</div>
          <ul className="drawer-links">
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('journey'); window.closeDrawer(); window.triggerChestAnimation();"
              >
                <div className="drawer-link-icon icon-gold">
                  <Icon icon={Icons.treasureChest} size={18} />
                </div>
                <span>Riddle Quest Chest</span>
                <span className="drawer-badge badge-gold">Unlock</span>
              </button>
            </li>
            <li>
              <button 
                className="drawer-link-btn" 
                onclick="window.switchMainTab('parents'); window.closeDrawer();"
              >
                <div className="drawer-link-icon icon-cyan">
                  <Icon icon={Icons.puzzle} size={18} />
                </div>
                <span>FAQ & Safety Support</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <a 
            href="#download" 
            className="btn-primary full-width" 
            onclick="window.switchMainTab('parents'); window.closeDrawer();"
          >
            <Icon icon={Icons.sparkles} size={18} />
            <span>Download Mobile App</span>
          </a>
          <div className="drawer-footer-note">
            <span>© {new Date().getFullYear()} Neon Activities HQ</span>
          </div>
        </div>
      </aside>
    </>
  )
}
