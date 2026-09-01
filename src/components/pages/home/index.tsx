import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

export const HomePage: FC = () => {
  return (
    <div className="page-wrapper">
      {/* Background Starfield Canvas and Ambient Nebulas */}
      <canvas id="starfield"></canvas>
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Header / Navbar */}
      <header className="site-header">
        <div className="container nav-container">
          <a href="#" className="logo-link">
            <div className="logo-icon-wrap">
              <Icon icon={Icons.rocketLaunch} size={24} color="#00f0ff" />
            </div>
            <div className="logo-text">
              <span className="logo-title">NEON <span>ACTIVITIES</span></span>
              <span className="logo-subtitle">Kids Brain HQ 🚀</span>
            </div>
          </a>

          <nav>
            <ul className="nav-menu">
              <li><a href="#arcade" className="nav-link">Play Mini-Games</a></li>
              <li><a href="#features" className="nav-link">Game Modes</a></li>
              <li><a href="#journey" className="nav-link">Galaxy Journey</a></li>
              <li><a href="#inclusive" className="nav-link">Inclusive Play</a></li>
              <li><a href="#parents" className="nav-link">Parents & Safety</a></li>
              <li><a href="#faq" className="nav-link">FAQ</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button id="audioToggleBtn" className="btn-audio" title="Toggle Cosmic Sound FX" aria-label="Toggle Sound">
              <span id="audioIcon">🔊</span>
            </button>
            <a href="#download" className="btn-primary">
              <span>Get App</span>
              <Icon icon={Icons.rocketLaunch} size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="badge-pill">
              <Icon icon={Icons.sparkles} size={16} color="#00f0ff" />
              <span>#1 Cosmic Kids Activity & Quiz Universe</span>
            </div>

            <h1 className="hero-title">
              Where Young Minds <span className="text-gradient-cyan glow-text-cyan">Solve</span>, <span className="text-gradient-cosmic glow-text-pink">Explore</span> & Conquer the Cosmos! 🚀
            </h1>

            <p className="hero-description">
              <strong>Neon Activities</strong> transforms daily screen time into a brain-boosting galactic adventure. Packed with cosmic puzzles, memory quests, logic labs, riddle adventures, and sensory-friendly inclusive activities designed for kids ages 4–12.
            </p>

            <div className="hero-cta-group">
              <a href="#arcade" className="btn-primary">
                <span>Play Live Mini-Arcade</span>
                <Icon icon={Icons.gamepad} size={20} />
              </a>
              <a href="#download" className="btn-secondary">
                <span>Download Free App</span>
                <Icon icon={Icons.star} size={18} color="#ff2a85" />
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500K+</span>
                <span className="stat-label">Cosmic Quests Solved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ color: 'var(--neon-pink)', textShadow: '0 0 10px var(--neon-pink-glow)' }}>4.9 ★</span>
                <span className="stat-label">Parent & Kid Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ color: 'var(--neon-gold)', textShadow: '0 0 10px var(--neon-gold-glow)' }}>100%</span>
                <span className="stat-label">Ad-Free & COPPA Safe</span>
              </div>
            </div>
          </div>

          {/* Interactive Mobile Device Mockup (Faithful reproduction of app screenshot) */}
          <div className="phone-mockup-wrapper">
            <div className="phone-glow-ambient"></div>
            
            <div className="phone-frame">
              {/* Phone Top Notch */}
              <div className="phone-notch">
                <div className="phone-camera"></div>
              </div>

              {/* Status Bar */}
              <div className="phone-status-bar">
                <span>9:41</span>
                <div className="status-icons">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* In-App Screen Content */}
              <div className="app-screen">
                {/* Header Welcome Bar */}
                <div className="app-topbar">
                  <span className="app-welcome">Welcome, Alex!</span>
                  <div className="app-user-actions">
                    <div className="app-avatar" title="Astronaut Profile">
                      <Icon icon={Icons.astronautNoto} size={24} />
                    </div>
                    <div className="app-settings-btn" title="Settings">
                      <Icon icon={Icons.settings} size={20} color="#00f0ff" />
                    </div>
                  </div>
                </div>

                {/* Neon Title HQ */}
                <div className="app-brand-banner">
                  <h2 className="app-neon-title">BRAIN QUEST HQ</h2>
                </div>

                {/* Daily Challenge Card */}
                <div className="app-daily-card" id="phoneDailyChallenge">
                  <div className="daily-card-header">DAILY CHALLENGE</div>
                  <div className="daily-card-title">COSMIC PUZZLE</div>
                  <div className="daily-card-body">
                    <div className="daily-galaxy-visual">
                      <div className="galaxy-swirl-ring"></div>
                      <div className="galaxy-center-core"></div>
                    </div>
                    <div className="daily-card-action">
                      <div className="puzzle-star-wrap">
                        <Icon icon={Icons.puzzle} size={24} color="#00f0ff" className="puzzle-icon-neon" />
                      </div>
                      <div className="stars-row">★★★</div>
                      <a href="#arcade" className="btn-app-pill">Play Now</a>
                    </div>
                  </div>
                </div>

                {/* Your Journey Card */}
                <div className="app-journey-section" id="journey">
                  <div className="section-label-row">
                    <span>YOUR JOURNEY</span>
                    <span className="section-label-sub">Level 1: Galaxy Maze</span>
                  </div>
                  <div className="journey-track-card">
                    <svg className="constellation-svg" viewBox="0 0 280 40">
                      {/* Wavy glowing constellation line */}
                      <path
                        d="M 15 20 Q 50 5, 85 24 T 155 16 T 225 22 T 265 14"
                        fill="none"
                        stroke="rgba(0, 240, 255, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      {/* Constellation Nodes */}
                      <circle cx="15" cy="20" r="4" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)" />
                      <circle cx="50" cy="10" r="5" fill="#9d4edd" filter="drop-shadow(0 0 6px #9d4edd)" />
                      <circle cx="85" cy="24" r="4" fill="#00f0ff" />
                      <circle cx="120" cy="18" r="5" fill="#ff2a85" filter="drop-shadow(0 0 6px #ff2a85)" />
                      <circle cx="155" cy="16" r="4" fill="#00f0ff" />
                      <circle cx="190" cy="25" r="5" fill="#9d4edd" />
                      <circle cx="225" cy="22" r="4" fill="#00f0ff" />
                      <circle cx="265" cy="14" r="6" fill="#ffd166" filter="drop-shadow(0 0 8px #ffd166)" />
                      {/* Player Pin at current node */}
                      <circle cx="225" cy="22" r="7" fill="none" stroke="#00f0ff" strokeWidth="2">
                        <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                </div>

                {/* Quick Games 2x2 Grid */}
                <div className="app-quick-games-section">
                  <div className="section-label-row">
                    <span>QUICK GAMES</span>
                  </div>
                  <div className="quick-games-grid">
                    {/* 1. Memory Match */}
                    <div className="app-game-card" onclick="window.switchArcadeTab('memory')">
                      <span className="game-card-num">1.</span>
                      <div className="game-icon-box">
                        <Icon icon={Icons.brain} size={22} color="#00f0ff" />
                      </div>
                      <div className="game-meta">
                        <span className="game-title">MEMORY<br/>MATCH</span>
                      </div>
                    </div>

                    {/* 2. Quiz Whiz */}
                    <div className="app-game-card" onclick="window.switchArcadeTab('quiz')">
                      <span className="game-card-num">2.</span>
                      <div className="game-icon-box">
                        <Icon icon={Icons.quiz} size={22} color="#ff2a85" />
                      </div>
                      <div className="game-meta">
                        <span className="game-title">QUIZ<br/>WHIZ</span>
                        <span className="game-sub-stars">★★★</span>
                      </div>
                    </div>

                    {/* 3. Logic Labs */}
                    <div className="app-game-card" onclick="window.switchArcadeTab('quiz')">
                      <span className="game-card-num">3.</span>
                      <div className="game-icon-box">
                        <Icon icon={Icons.lightbulb} size={22} color="#ffd166" />
                      </div>
                      <div className="game-meta">
                        <span className="game-title">LOGIC<br/>LABS</span>
                      </div>
                    </div>

                    {/* 4. Pattern Pals */}
                    <div className="app-game-card" onclick="window.switchArcadeTab('pattern')">
                      <span className="game-card-num">4.</span>
                      <div className="game-icon-box">
                        <Icon icon={Icons.shapes} size={22} color="#00f0ff" />
                      </div>
                      <div className="game-meta">
                        <span className="game-title">PATTERN<br/>PALS</span>
                        <span style={{ fontSize: '0.55rem', color: '#ff2a85' }}>--•--△</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Riddle Quest Banner */}
                <div className="app-riddle-banner" onclick="window.triggerChestAnimation()">
                  <div className="riddle-info">
                    <span className="riddle-main-title">RIDDLE QUEST</span>
                    <span className="riddle-subtext">Start Adventure ✨</span>
                  </div>
                  <div className="riddle-chest-icon">
                    <Icon icon={Icons.treasureChest} size={28} color="#ffd166" />
                  </div>
                </div>

                {/* Special Needs Support Card */}
                <div className="app-special-needs-card">
                  <div className="sn-icon-wrap">
                    <Icon icon={Icons.inclusiveHands} size={26} color="#00f0ff" />
                  </div>
                  <div className="sn-info">
                    <span className="sn-tag">SPECIAL NEEDS SUPPORT</span>
                    <div className="sn-title">EXPLORE INCLUSIVE GAMES</div>
                    <span className="sn-desc">Calm, Adaptive, Engaging</span>
                  </div>
                  <a href="#inclusive" className="btn-sn-learn">Learn More</a>
                </div>

                {/* Bottom Navigation Dock */}
                <div className="app-bottom-nav">
                  <div className="nav-tab-item active">
                    <Icon icon={Icons.rocketLaunch} size={18} color="#00f0ff" />
                    <span>HOME</span>
                  </div>
                  <div className="nav-tab-item" onclick="window.switchArcadeTab('quiz')">
                    <Icon icon={Icons.gamepad} size={18} color="#9aa8cf" />
                    <span>GAMES</span>
                  </div>
                  <div className="nav-tab-item">
                    <Icon icon={Icons.trophy} size={18} color="#9aa8cf" />
                    <span>ACHIEVEMENTS</span>
                  </div>
                  <div className="nav-tab-item profile-active">
                    <Icon icon={Icons.profile} size={18} color="#ff2a85" />
                    <span>PROFILE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playable Mini-Arcade Sandbox */}
      <section className="arcade-section" id="arcade">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Playable Live Demo</span>
            <h2 className="section-heading text-gradient-cyan">Test-Drive Neon Activities Right Here! 🎮</h2>
            <p className="section-subtext">
              Try sample mini-games from our 4 flagship activity modules. Experience the cosmic audio, radiant neon glows, and kid-friendly logic puzzles!
            </p>
          </div>

          <div className="arcade-card-container">
            <div className="arcade-tabs">
              <button className="arcade-tab-btn active" id="tabQuizBtn" onclick="window.switchArcadeTab('quiz')">
                <Icon icon={Icons.quiz} size={18} />
                <span>Quiz Whiz Trivia</span>
              </button>
              <button className="arcade-tab-btn tab-pink" id="tabMemoryBtn" onclick="window.switchArcadeTab('memory')">
                <Icon icon={Icons.brain} size={18} />
                <span>Memory Match (4 Cards)</span>
              </button>
              <button className="arcade-tab-btn tab-gold" id="tabPatternBtn" onclick="window.switchArcadeTab('pattern')">
                <Icon icon={Icons.shapes} size={18} />
                <span>Pattern Pals Logic</span>
              </button>
            </div>

            {/* Panel 1: Quiz Whiz */}
            <div className="mini-game-panel active" id="panelQuiz">
              <div className="quiz-game-box">
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" id="quizProgressBar"></div>
                </div>

                <div className="quiz-question-card">
                  <div style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                    <span id="quizStepNumber">QUESTION 1 OF 3</span> • COSMIC SCIENCE & RIDDLES
                  </div>
                  <h3 className="quiz-question-text" id="quizQuestionTitle">
                    Which planet in our solar system is famous for having giant glowing icy rings?
                  </h3>

                  <div className="quiz-options-grid" id="quizOptionsContainer">
                    {/* Rendered dynamically by script */}
                  </div>
                </div>

                <div className="quiz-feedback" id="quizFeedback"></div>
              </div>
            </div>

            {/* Panel 2: Memory Match */}
            <div className="mini-game-panel" id="panelMemory">
              <div className="quiz-game-box">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Galactic Memory Pair Quest 🧠✨</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Tap two cards to find matching cosmic brain symbols. Match them all to earn a galactic star!
                </p>

                <div className="memory-grid" id="memoryGrid">
                  {/* Generated by script */}
                </div>

                <div className="quiz-feedback" id="memoryFeedback"></div>
              </div>
            </div>

            {/* Panel 3: Pattern Pals */}
            <div className="mini-game-panel" id="panelPattern">
              <div className="quiz-game-box">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Pattern Pals: Complete the Sequence 🧩</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Look closely at the pattern below and choose the missing shape to restore cosmic balance!
                </p>

                <div className="pattern-sequence">
                  <div className="pattern-item" title="Circle">🔵</div>
                  <div className="pattern-item" title="Gear">⚙️</div>
                  <div className="pattern-item" title="Circle">🔵</div>
                  <div className="pattern-item" title="Gear">⚙️</div>
                  <div className="pattern-item pattern-slot-target" id="patternSlot" title="Missing Shape">❓</div>
                </div>

                <div className="pattern-choices">
                  <button className="pattern-choice-btn" onclick="window.checkPattern('⭐', false)">⭐</button>
                  <button className="pattern-choice-btn" onclick="window.checkPattern('🔵', true)">🔵</button>
                  <button className="pattern-choice-btn" onclick="window.checkPattern('🔺', false)">🔺</button>
                  <button className="pattern-choice-btn" onclick="window.checkPattern('🚀', false)">🚀</button>
                </div>

                <div className="quiz-feedback" id="patternFeedback"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Core Game Modes Deep-Dive */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Game Ecosystem</span>
            <h2 className="section-heading text-gradient-cosmic">6 Galactic Brain-Building Modules</h2>
            <p className="section-subtext">
              Engineered with child development specialists to nurture memory, lateral logic, reading comprehension, and spatial problem-solving.
            </p>
          </div>

          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.puzzle} size={28} color="#00f0ff" />
              </div>
              <h3 className="feature-title">Daily Cosmic Puzzles</h3>
              <p className="feature-text">
                Fresh bite-sized challenges dropped every morning with daily streak rewards. Keeps curiosity buzzing without screen addiction.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card card-pink">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.brain} size={28} color="#ff2a85" />
              </div>
              <h3 className="feature-title">Galaxy Memory Match</h3>
              <p className="feature-text">
                Multi-level card matching and audio recall challenges designed to strengthen working memory and pattern recognition.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card card-gold">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.quiz} size={28} color="#ffd166" />
              </div>
              <h3 className="feature-title">Quiz Whiz Trivia</h3>
              <p className="feature-text">
                Explore science, animals, space, mythology, and world wonders with gentle hints, colorful illustrations, and voice narration.
              </p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.lightbulb} size={28} color="#00f0ff" />
              </div>
              <h3 className="feature-title">Logic Labs & Circuits</h3>
              <p className="feature-text">
                Connecting galactic power lines, solving maze paths, and decoding light sequences to foster early STEM problem solving.
              </p>
            </div>

            {/* Card 5 */}
            <div className="feature-card card-pink">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.treasureChest} size={28} color="#ff2a85" />
              </div>
              <h3 className="feature-title">Riddle Quest Mystery Chests</h3>
              <p className="feature-text">
                Engaging story-driven mysteries where kids decipher clues, unlock cosmic treasure chests, and discover rare astronaut badges.
              </p>
            </div>

            {/* Card 6 */}
            <div className="feature-card card-gold">
              <div className="feature-icon-wrapper">
                <Icon icon={Icons.shapes} size={28} color="#ffd166" />
              </div>
              <h3 className="feature-title">Pattern Pals & Geometry</h3>
              <p className="feature-text">
                Spatial reasoning, rotation puzzles, and sequence continuation games that make geometry and symmetry intuitive and playful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Needs & Inclusive Play Spotlight */}
      <section className="inclusive-section" id="inclusive">
        <div className="container">
          <div className="inclusive-banner-card">
            <div>
              <div className="badge-pill" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                <Icon icon={Icons.inclusiveHands} size={16} color="#ff2a85" />
                <span>Special Needs & Inclusive Design</span>
              </div>
              <h2 className="section-heading" style={{ marginTop: '16px' }}>
                Every Child Deserves to <span className="text-gradient-cyan">Shine in Space</span> 🌟
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                <strong>Neon Activities</strong> is built from the ground up to be sensory-friendly and neurodiverse-welcoming. Designed with input from pediatric occupational therapists, our adaptive modes remove high-stress timers and support diverse learning paces.
              </p>

              <div className="inclusive-pills">
                <span className="inclusive-pill">✨ Calm Sensory Palette</span>
                <span className="inclusive-pill">⏱️ Zero-Timer Mode</span>
                <span className="inclusive-pill">📖 OpenDyslexic Font Option</span>
                <span className="inclusive-pill">🔊 Full Audio Narration</span>
                <span className="inclusive-pill">🖐️ Single-Finger Big Touch Targets</span>
              </div>
            </div>

            <div className="inclusive-interactive-box">
              <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '8px' }}>Adaptive Play Simulator</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle assistive modes built right into the app:</p>

              <div className="inclusive-modes-list">
                <div className="mode-toggle-item">
                  <span>Sensory Calm Mode</span>
                  <div className="mode-toggle-switch" onclick="this.classList.toggle('active')"></div>
                </div>
                <div className="mode-toggle-item">
                  <span>No-Rush Relaxed Pacing</span>
                  <div className="mode-toggle-switch" onclick="this.classList.toggle('active')"></div>
                </div>
                <div className="mode-toggle-item">
                  <span>Voice Guided Narration</span>
                  <div className="mode-toggle-switch" onclick="this.classList.toggle('active')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent & Educator Mission Control */}
      <section className="safety-section" id="parents">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Parent Mission Control</span>
            <h2 className="section-heading text-gradient-cyan">100% Kid-Safe, Ad-Free & Stress-Free</h2>
            <p className="section-subtext">
              We care about digital wellbeing as much as you do. Neon Activities delivers guilt-free screen time that genuinely educates.
            </p>
          </div>

          <div className="safety-grid">
            <div className="safety-card">
              <div className="safety-icon">🛡️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zero Ads & Third-Party Trackers</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Certified COPPA and GDPR-K compliant. No external links, no banner ads, and no unexpected popups.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon">📊</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Cognitive Growth Insights</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Parents receive weekly reports on skills exercised (memory, logic, vocabulary) without test-taking anxiety.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon">✈️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>100% Offline Exploration</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Download packs for flights, road trips, and offline fun. Never get stranded without entertainment!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Galactic Feedback</span>
            <h2 className="section-heading text-gradient-gold">Loved by 50,000+ Families & Teachers</h2>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "My 7-year-old son Alex is obsessed with space. Neon Activities has become our favorite morning routine. The Quiz Whiz and Riddle Quest are pure genius!"
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">🚀</div>
                <div>
                  <div className="reviewer-name">Sarah Jenkins</div>
                  <div className="reviewer-role">Mom of 2 • Austin, TX</div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "As a special education teacher, finding apps that offer sensory-friendly modes without patronizing the kids is rare. Neon Activities nailed it!"
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">⭐</div>
                <div>
                  <div className="reviewer-name">Marcus Sterling</div>
                  <div className="reviewer-role">Elementary Special Ed Specialist</div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "The cosmic neon theme looks incredible on tablet screens. The Memory Match and Logic Labs really push critical thinking in such a fun way."
              </p>
              <div className="reviewer-meta">
                <div className="reviewer-avatar">🛰️</div>
                <div>
                  <div className="reviewer-name">Dr. Emily Chen</div>
                  <div className="reviewer-role">Cognitive Psychologist & Parent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Common Questions</span>
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            <div className="faq-item active" onclick="this.classList.toggle('active')">
              <button className="faq-question">
                <span>What age group is Neon Activities designed for?</span>
                <span className="faq-icon">▼</span>
              </button>
              <div className="faq-answer">
                Neon Activities features adaptive difficulty tiers tailored for young explorers ages 4 to 12. Puzzles and quiz questions automatically adjust as your child masters skills.
              </div>
            </div>

            <div className="faq-item" onclick="this.classList.toggle('active')">
              <button className="faq-question">
                <span>Is the app safe for kids to use independently?</span>
                <span className="faq-icon">▼</span>
              </button>
              <div className="faq-answer">
                Yes, absolutely! Neon Activities is 100% ad-free, COPPA certified, contains no external chat, and includes a secure parental gate for any subscription settings.
              </div>
            </div>

            <div className="faq-item" onclick="this.classList.toggle('active')">
              <button className="faq-question">
                <span>Can multiple kids have their own astronaut profiles?</span>
                <span className="faq-icon">▼</span>
              </button>
              <div className="faq-answer">
                Yes! You can create up to 4 distinct explorer profiles with custom astronaut avatars, individualized constellation progression paths, and personalized star counters.
              </div>
            </div>

            <div className="faq-item" onclick="this.classList.toggle('active')">
              <button className="faq-question">
                <span>Does the app work without Wi-Fi?</span>
                <span className="faq-icon">▼</span>
              </button>
              <div className="faq-answer">
                Yes! All core game modules, quizzes, and constellation levels can be fully downloaded for offline play during flights, road trips, or quiet time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-section" id="download">
        <div className="container">
          <div className="cta-glow-card">
            <div className="badge-pill" style={{ margin: '0 auto 16px' }}>
              <Icon icon={Icons.sparkles} size={16} />
              <span>Ready for Launch</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
              Start Your Child’s Cosmic Adventure Today! 🚀
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 28px', fontSize: '1.1rem' }}>
              Join hundreds of thousands of young explorers learning through memory puzzles, riddle quests, and logic challenges.
            </p>

            <div className="cta-badges-row">
              <a href="#" className="store-badge" onclick="alert('Neon Activities for iOS is coming to the App Store soon! 🎉'); return false;">
                <Icon icon={Icons.apple} size={28} color="#fff" />
                <div style={{ textAlign: 'left' }}>
                  <span className="badge-text-sub">Download on the</span>
                  <span className="badge-text-main">App Store</span>
                </div>
              </a>

              <a href="#" className="store-badge" onclick="alert('Neon Activities for Android is coming to Google Play soon! 🎉'); return false;">
                <Icon icon={Icons.googlePlay} size={28} color="#00f0ff" />
                <div style={{ textAlign: 'left' }}>
                  <span className="badge-text-sub">Get it on</span>
                  <span className="badge-text-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo-link">
                <div className="logo-icon-wrap">
                  <Icon icon={Icons.rocketLaunch} size={22} color="#00f0ff" />
                </div>
                <div className="logo-text">
                  <span className="logo-title">NEON <span>ACTIVITIES</span></span>
                  <span className="logo-subtitle">Kids Brain HQ 🚀</span>
                </div>
              </a>
              <p>
                The cosmic playground where cognitive growth, joyful exploration, and inclusive learning unite in radiant neon light.
              </p>
            </div>

            <div>
              <h4 className="footer-title">Game Modes</h4>
              <ul className="footer-links">
                <li><a href="#arcade">Daily Cosmic Puzzle</a></li>
                <li><a href="#arcade">Galaxy Memory Match</a></li>
                <li><a href="#arcade">Quiz Whiz Trivia</a></li>
                <li><a href="#arcade">Logic Labs</a></li>
                <li><a href="#arcade">Pattern Pals</a></li>
                <li><a href="#arcade">Riddle Quest</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">Parent Hub</h4>
              <ul className="footer-links">
                <li><a href="#inclusive">Inclusive Play Guide</a></li>
                <li><a href="#parents">Safety & Privacy</a></li>
                <li><a href="#parents">COPPA Certification</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#">Educator Licensing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">Weekly Riddle Drop</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Get 3 free printable cosmic riddles and brain teasers in your inbox every Sunday!
              </p>
              <form className="footer-newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed! Check your inbox for this week\\'s free riddle pack! 🚀');">
                <input type="email" placeholder="Parent's email address..." className="newsletter-input" required />
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Join</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Neon Activities HQ. All Rights Reserved.</span>
            <span>Designed for Curious Explorers Across the Universe 🌌</span>
          </div>
        </div>
      </footer>

      {/* Embedded Client-Side Script for Interactive Sandbox & Synth Sounds */}
      <script>
        {raw(`
            // ==========================================
            // Starfield Particle Canvas Generator
            // ==========================================
            (function() {
              const canvas = document.getElementById('starfield');
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              let width = canvas.width = window.innerWidth;
              let height = canvas.height = window.innerHeight;

              const stars = [];
              const STAR_COUNT = Math.min(Math.floor(width * 0.12), 120);

              for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                  x: Math.random() * width,
                  y: Math.random() * height,
                  radius: Math.random() * 1.6 + 0.4,
                  alpha: Math.random() * 0.8 + 0.2,
                  twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                  color: Math.random() > 0.7 ? '#00f0ff' : (Math.random() > 0.5 ? '#ff2a85' : '#ffffff')
                });
              }

              function draw() {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < stars.length; i++) {
                  const s = stars[i];
                  s.alpha += s.twinkleSpeed;
                  if (s.alpha > 0.95 || s.alpha < 0.2) {
                    s.twinkleSpeed = -s.twinkleSpeed;
                  }

                  ctx.beginPath();
                  ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                  ctx.fillStyle = s.color;
                  ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
                  ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
                  ctx.shadowColor = s.color;
                  ctx.fill();
                }
                requestAnimationFrame(draw);
              }

              window.addEventListener('resize', function() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
              });

              draw();
            })();

            // ==========================================
            // Web Audio API Cosmic Sound Synthesizer
            // ==========================================
            let audioEnabled = true;
            let audioCtx = null;

            function getAudioContext() {
              if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
              }
              if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
              }
              return audioCtx;
            }

            function playSynthSound(type) {
              if (!audioEnabled) return;
              try {
                const ctx = getAudioContext();
                if (!ctx) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const now = ctx.currentTime;

                if (type === 'correct') {
                  // Cheerful chord chime
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(523.25, now); // C5
                  osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
                  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
                  osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6
                  gain.gain.setValueAtTime(0.2, now);
                  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                  osc.start(now);
                  osc.stop(now + 0.45);
                } else if (type === 'wrong') {
                  // Gentle boing
                  osc.type = 'triangle';
                  osc.frequency.setValueAtTime(220, now);
                  osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
                  gain.gain.setValueAtTime(0.25, now);
                  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                  osc.start(now);
                  osc.stop(now + 0.3);
                } else if (type === 'flip') {
                  // Quick pop
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(400, now);
                  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                  gain.gain.setValueAtTime(0.15, now);
                  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                  osc.start(now);
                  osc.stop(now + 0.1);
                } else if (type === 'chest') {
                  // Mystery fanfare
                  osc.type = 'square';
                  osc.frequency.setValueAtTime(440, now);
                  osc.frequency.setValueAtTime(554.37, now + 0.1);
                  osc.frequency.setValueAtTime(659.25, now + 0.2);
                  osc.frequency.setValueAtTime(880, now + 0.3);
                  gain.gain.setValueAtTime(0.12, now);
                  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                  osc.start(now);
                  osc.stop(now + 0.5);
                }
              } catch(e) {
                console.warn('Audio synthesis error:', e);
              }
            }

            // Audio Toggle Button
            document.addEventListener('DOMContentLoaded', function() {
              const audioBtn = document.getElementById('audioToggleBtn');
              const audioIcon = document.getElementById('audioIcon');
              if (audioBtn) {
                audioBtn.addEventListener('click', function() {
                  audioEnabled = !audioEnabled;
                  if (audioIcon) audioIcon.textContent = audioEnabled ? '🔊' : '🔇';
                  if (audioEnabled) playSynthSound('correct');
                });
              }
            });

            // ==========================================
            // Interactive Tab Switcher
            // ==========================================
            window.switchArcadeTab = function(tabName) {
              const tabs = {
                quiz: { btn: 'tabQuizBtn', panel: 'panelQuiz' },
                memory: { btn: 'tabMemoryBtn', panel: 'panelMemory' },
                pattern: { btn: 'tabPatternBtn', panel: 'panelPattern' }
              };

              Object.keys(tabs).forEach(function(key) {
                const b = document.getElementById(tabs[key].btn);
                const p = document.getElementById(tabs[key].panel);
                if (b) b.classList.remove('active');
                if (p) p.classList.remove('active');
              });

              const current = tabs[tabName] || tabs.quiz;
              const currentBtn = document.getElementById(current.btn);
              const currentPanel = document.getElementById(current.panel);
              if (currentBtn) currentBtn.classList.add('active');
              if (currentPanel) currentPanel.classList.add('active');
              playSynthSound('flip');
            };

            // ==========================================
            // Mini-Game 1: Cosmic Quiz Whiz Engine
            // ==========================================
            const quizQuestions = [
              {
                question: "Which planet in our solar system is famous for having giant glowing icy rings?",
                options: ["Mars 🔴", "Saturn 🪐", "Jupiter 🌪️", "Neptune 🌊"],
                correct: 1,
                fact: "Awesome! Saturn has thousands of beautiful rings made of ice, rock, and stardust! 🌟"
              },
              {
                question: "What keeps all the planets orbiting around the Sun without flying away?",
                options: ["Solar Wind 💨", "Magnetic Dust 🧲", "Gravity 🌌", "Cosmic Glue 🪄"],
                correct: 2,
                fact: "Spot on! Gravity is the invisible cosmic pull that keeps planets in their galaxy tracks! 🚀"
              },
              {
                question: "Which astronaut vehicle is built to explore the bumpy surface of the Moon or Mars?",
                options: ["Space Rover 🚜", "Galaxy Submarine 🚢", "Jet Hoverboard 🛹", "Helicopter 🚁"],
                correct: 0,
                fact: "Brilliant explorer! Rovers like Curiosity and Perseverance roll across red Martian dunes! 🤖"
              }
            ];

            let currentQuizIndex = 0;

            function renderQuizQuestion() {
              const q = quizQuestions[currentQuizIndex];
              const titleEl = document.getElementById('quizQuestionTitle');
              const stepEl = document.getElementById('quizStepNumber');
              const optContainer = document.getElementById('quizOptionsContainer');
              const progressFill = document.getElementById('quizProgressFill');
              const feedback = document.getElementById('quizFeedback');

              if (!titleEl || !optContainer) return;

              titleEl.textContent = q.question;
              if (stepEl) stepEl.textContent = 'QUESTION ' + (currentQuizIndex + 1) + ' OF ' + quizQuestions.length;
              if (progressFill) progressFill.style.width = ((currentQuizIndex + 1) / quizQuestions.length * 100) + '%';
              if (feedback) feedback.innerHTML = '';

              optContainer.innerHTML = '';
              q.options.forEach(function(optText, index) {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.innerHTML = '<span style="color: var(--neon-cyan); font-weight: 800;">' + String.fromCharCode(65 + index) + '.</span> ' + optText;
                btn.onclick = function() {
                  window.handleQuizAnswer(index);
                };
                optContainer.appendChild(btn);
              });
            }

            window.handleQuizAnswer = function(selectedIndex) {
              const q = quizQuestions[currentQuizIndex];
              const optContainer = document.getElementById('quizOptionsContainer');
              const feedback = document.getElementById('quizFeedback');
              if (!optContainer) return;

              const buttons = optContainer.querySelectorAll('.quiz-opt-btn');
              buttons.forEach(function(b) { b.disabled = true; });

              if (selectedIndex === q.correct) {
                buttons[selectedIndex].classList.add('correct');
                playSynthSound('correct');
                if (feedback) {
                  feedback.innerHTML = '<span style="color: var(--neon-green); text-shadow: 0 0 10px var(--neon-green-glow)">✨ Correct! ' + q.fact + '</span>';
                }

                setTimeout(function() {
                  currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
                  renderQuizQuestion();
                }, 2200);
              } else {
                buttons[selectedIndex].classList.add('wrong');
                buttons[q.correct].classList.add('correct');
                playSynthSound('wrong');
                if (feedback) {
                  feedback.innerHTML = '<span style="color: #ff4d6d">Almost! Try the next question! ⭐</span>';
                }

                setTimeout(function() {
                  currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
                  renderQuizQuestion();
                }, 2400);
              }
            };

            // ==========================================
            // Mini-Game 2: Galactic Memory Match
            // ==========================================
            const memoryCardsData = [
              { id: 1, icon: '🧠', matched: false },
              { id: 2, icon: '🚀', matched: false },
              { id: 3, icon: '🧠', matched: false },
              { id: 4, icon: '🚀', matched: false }
            ];

            let flippedCards = [];
            let matchedPairsCount = 0;

            function initMemoryGrid() {
              const container = document.getElementById('memoryGrid');
              const feedback = document.getElementById('memoryFeedback');
              if (!container) return;

              container.innerHTML = '';
              flippedCards = [];
              matchedPairsCount = 0;
              if (feedback) feedback.innerHTML = '';

              memoryCardsData.forEach(function(card, idx) {
                const cardEl = document.createElement('div');
                cardEl.className = 'memory-card';
                cardEl.id = 'mem-card-' + idx;
                cardEl.innerHTML = 
                  '<div class="memory-inner">' +
                    '<div class="memory-front">❓</div>' +
                    '<div class="memory-back">' + card.icon + '</div>' +
                  '</div>';
                
                cardEl.onclick = function() {
                  window.flipMemoryCard(cardEl, card, idx);
                };
                container.appendChild(cardEl);
              });
            }

            window.flipMemoryCard = function(el, card, idx) {
              if (el.classList.contains('flipped') || flippedCards.length >= 2) return;

              el.classList.add('flipped');
              playSynthSound('flip');
              flippedCards.push({ el: el, card: card, idx: idx });

              if (flippedCards.length === 2) {
                const first = flippedCards[0];
                const second = flippedCards[1];

                if (first.card.icon === second.card.icon) {
                  playSynthSound('correct');
                  matchedPairsCount++;
                  flippedCards = [];
                  const feedback = document.getElementById('memoryFeedback');
                  if (matchedPairsCount === 2) {
                    if (feedback) {
                      feedback.innerHTML = '<span style="color: var(--neon-gold); text-shadow: 0 0 10px var(--neon-gold-glow)">🎉 Stellar Memory! You matched all pairs! (Restarting...)</span>';
                    }
                    setTimeout(initMemoryGrid, 3000);
                  }
                } else {
                  playSynthSound('wrong');
                  setTimeout(function() {
                    first.el.classList.remove('flipped');
                    second.el.classList.remove('flipped');
                    flippedCards = [];
                  }, 900);
                }
              }
            };

            // ==========================================
            // Mini-Game 3: Pattern Pals Logic
            // ==========================================
            window.checkPattern = function(choice, isCorrect) {
              const slot = document.getElementById('patternSlot');
              const feedback = document.getElementById('patternFeedback');
              if (!slot || !feedback) return;

              slot.textContent = choice;

              if (isCorrect) {
                slot.style.borderColor = 'var(--neon-green)';
                slot.style.boxShadow = '0 0 20px var(--neon-green-glow)';
                feedback.innerHTML = '<span style="color: var(--neon-green); text-shadow: 0 0 10px var(--neon-green-glow)">✨ Pattern Complete! Circle ➡️ Gear ➡️ Circle ➡️ Gear ➡️ Circle! ⭐</span>';
                playSynthSound('correct');
              } else {
                slot.style.borderColor = '#ff4d6d';
                slot.style.boxShadow = '0 0 16px rgba(255, 77, 109, 0.6)';
                feedback.innerHTML = '<span style="color: #ff4d6d">Not quite! Look at the alternation: 🔵 ⚙️ 🔵 ⚙️ ?</span>';
                playSynthSound('wrong');
              }
            };

            // Chest animation trigger
            window.triggerChestAnimation = function() {
              playSynthSound('chest');
              alert('✨ Riddle Quest Unlocked! "I have rings but no fingers, I spin in the night. What am I?" (Answer: Saturn! 🪐)');
            };

            // Initialize all mini-games upon page load
            document.addEventListener('DOMContentLoaded', function() {
              renderQuizQuestion();
              initMemoryGrid();
            });
          `)}
      </script>
    </div>
  )
}
