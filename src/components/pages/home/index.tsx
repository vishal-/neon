import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'
import { Header } from '../../common'

export const HomePage: FC = () => {
  return (
    <div className="page-wrapper">
      {/* Background Starfield Canvas and Ambient Nebulas */}
      <canvas id="starfield"></canvas>
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Global Top Header with Hamburger, Centered Logo, and Right User Info */}
      <Header />

      {/* Central Max-Width App Shell for Tablet & Desktop */}
      <main className="cosmic-app-container">
        {/* Desktop Tab Selector Bar (Constrained Max-Width Shell) */}
        <nav className="desktop-tab-bar" aria-label="Main Cosmic Navigation">
          <button 
            className="main-tab-btn active" 
            id="tabNav-hq" 
            data-tab="hq"
            onclick="window.switchMainTab('hq')"
          >
            <Icon icon={Icons.rocketLaunch} size={18} />
            <span>HQ & Daily</span>
          </button>
          
          <button 
            className="main-tab-btn" 
            id="tabNav-games" 
            data-tab="games"
            onclick="window.switchMainTab('games')"
          >
            <Icon icon={Icons.gamepad} size={18} />
            <span>Game Arenas</span>
          </button>

          <button 
            className="main-tab-btn" 
            id="tabNav-journey" 
            data-tab="journey"
            onclick="window.switchMainTab('journey')"
          >
            <Icon icon={Icons.star} size={18} />
            <span>Star Journey</span>
          </button>

          <button 
            className="main-tab-btn" 
            id="tabNav-inclusive" 
            data-tab="inclusive"
            onclick="window.switchMainTab('inclusive')"
          >
            <Icon icon={Icons.inclusiveHands} size={18} />
            <span>Inclusive Play</span>
          </button>

          <button 
            className="main-tab-btn" 
            id="tabNav-parents" 
            data-tab="parents"
            onclick="window.switchMainTab('parents')"
          >
            <Icon icon={Icons.shieldCheck} size={18} />
            <span>Parent Hub</span>
          </button>
        </nav>

        {/* ========================================================= */}
        {/* TAB PANEL 1: HQ & DAILY QUEST (HERO + VORTEX)              */}
        {/* ========================================================= */}
        <section className="tab-panel active" id="panel-hq">
          {/* User Profile & Mission Status Card */}
          <div className="explorer-profile-card">
            <div className="profile-left">
              <div className="avatar-ring">
                <Icon icon={Icons.astronautNoto} size={36} />
              </div>
              <div className="profile-meta">
                <div className="user-greeting">Welcome back, Cadet Alex! 🧑‍🚀</div>
                <div className="user-level">Explorer Level 1 • Galaxy Maze • 350 / 500 XP</div>
              </div>
            </div>
            <div className="profile-right">
              <div className="xp-pill">
                <Icon icon={Icons.star} size={16} color="#fcd34d" />
                <span>Supernova Rank: Silver</span>
              </div>
            </div>
          </div>

          {/* Hero Mission Spotlight */}
          <div className="hero-cockpit-card">
            <div className="badge-pill">
              <Icon icon={Icons.sparkles} size={16} color="#7ee7c9" />
              <span>Cosmic Learning Universe for Ages 4–12</span>
            </div>

            <h1 className="hero-title">
              Where Curious Minds <span className="text-gradient-cyan">Solve</span>, <span className="text-gradient-cosmic">Explore</span> & Conquer the Cosmos! 🚀
            </h1>

            <p className="hero-description">
              Turn screen time into a thrilling galactic journey. Daily logic labs, memory pair quests, astronomy trivia, and sensory-friendly adventures crafted for growing young minds.
            </p>

            <div className="hero-action-buttons">
              <button className="btn-primary" onclick="window.switchMainTab('games')">
                <span>Play Live Arenas</span>
                <Icon icon={Icons.gamepad} size={20} />
              </button>
              <button className="btn-secondary" onclick="window.switchMainTab('journey')">
                <span>View Star Map</span>
                <Icon icon={Icons.star} size={18} color="#c084fc" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="hero-stats-row">
              <div className="stat-box">
                <span className="stat-number">500K+</span>
                <span className="stat-label">Quests Solved</span>
              </div>
              <div className="stat-box">
                <span className="stat-number color-pink">4.9 ★</span>
                <span className="stat-label">Kid & Parent Rating</span>
              </div>
              <div className="stat-box">
                <span className="stat-number color-gold">100%</span>
                <span className="stat-label">Ad-Free & Kid-Safe</span>
              </div>
            </div>
          </div>

          {/* Today's Featured Cosmic Vortex Challenge */}
          <div className="spotlight-challenge-card" id="daily-challenge">
            <div className="challenge-header">
              <div className="challenge-tag-row">
                <span className="challenge-tag">TODAY'S COSMIC QUEST</span>
                <div className="stars-glow-row">★★★</div>
              </div>
              <span className="reward-badge">+50 XP</span>
            </div>

            <h3 className="challenge-main-title">COSMIC PUZZLE: THE GALAXY VORTEX</h3>
            <p className="challenge-desc">
              Decipher the starry planetary vortex and align the cosmic constellation nodes to unlock the Nebula Gates!
            </p>

            <div className="galaxy-vortex-visual">
              <div className="vortex-core"></div>
              <div className="vortex-rings"></div>
              <div className="vortex-planet p-1" title="Saturn">🪐</div>
              <div className="vortex-planet p-2" title="Star">⭐</div>
              <div className="vortex-planet p-3" title="Rocket">🚀</div>
            </div>

            <div className="challenge-action-wrap">
              <button className="btn-primary full-width" onclick="window.switchMainTab('games'); window.switchArcadeTab('quiz');">
                <span>Launch Today's Quest Demo</span>
                <Icon icon={Icons.gamepad} size={18} />
              </button>
            </div>
          </div>

          {/* Quick Launch Cards Preview */}
          <div className="quick-access-strip">
            <h4 className="strip-title">Jump to Mission Arenas</h4>
            <div className="quick-access-grid">
              <div className="access-chip chip-cyan" onclick="window.switchMainTab('games'); window.switchArcadeTab('memory');">
                <Icon icon={Icons.brain} size={22} color="#7ee7c9" />
                <span>Memory Match</span>
              </div>
              <div className="access-chip chip-pink" onclick="window.switchMainTab('games'); window.switchArcadeTab('quiz');">
                <Icon icon={Icons.quiz} size={22} color="#c084fc" />
                <span>Quiz Whiz</span>
              </div>
              <div className="access-chip chip-gold" onclick="window.switchMainTab('games'); window.switchArcadeTab('pattern');">
                <Icon icon={Icons.shapes} size={22} color="#fcd34d" />
                <span>Pattern Pals</span>
              </div>
              <div className="access-chip chip-purple" onclick="window.switchMainTab('journey');">
                <Icon icon={Icons.treasureChest} size={22} color="#a78bfa" />
                <span>Riddle Quest</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TAB PANEL 2: GAME ARENAS & INTERACTIVE SANDBOX             */}
        {/* ========================================================= */}
        <section className="tab-panel" id="panel-games">
          <div className="section-head-box">
            <span className="section-tag">Central Command</span>
            <h2 className="section-heading text-gradient-cyan">Brain Quest HQ: 4 Core Arenas 🎮</h2>
            <p className="section-subtext">
              Jump directly into the flagship activity modules crafted for memory, logic deduction, and spatial mastery.
            </p>
          </div>

          {/* 4 Core Game Cards Grid */}
          <div className="games-grid">
            {/* Card 1: Memory Match */}
            <div className="arena-card card-cyan" onclick="window.switchArcadeTab('memory')">
              <div className="arena-card-top">
                <span className="arena-number">01</span>
                <span className="arena-stars">★★★</span>
              </div>
              <div className="arena-icon-box">
                <Icon icon={Icons.brain} size={42} color="#00f0ff" />
              </div>
              <h3 className="arena-title">Memory Match</h3>
              <p className="arena-desc">
                Flip glowing cosmic brain cards, identify pairs, and sharpen working memory across multiple difficulty tiers.
              </p>
              <button className="arena-btn btn-cyan">
                <span>Play Live Demo</span>
                <Icon icon={Icons.gamepad} size={16} />
              </button>
            </div>

            {/* Card 2: Quiz Whiz */}
            <div className="arena-card card-pink" onclick="window.switchArcadeTab('quiz')">
              <div className="arena-card-top">
                <span className="arena-number" style={{ color: 'var(--neon-pink)' }}>02</span>
                <span className="arena-stars">★★★</span>
              </div>
              <div className="arena-icon-box">
                <Icon icon={Icons.quiz} size={42} color="#ff2a85" />
              </div>
              <h3 className="arena-title">Quiz Whiz</h3>
              <p className="arena-desc">
                Bite-sized astronomy, science, nature and STEM trivia with cheerful clues and instant feedback.
              </p>
              <button className="arena-btn btn-pink">
                <span>Test Trivia</span>
                <Icon icon={Icons.sparkles} size={16} />
              </button>
            </div>

            {/* Card 3: Logic Labs */}
            <div className="arena-card card-gold" onclick="window.switchArcadeTab('quiz')">
              <div className="arena-card-top">
                <span className="arena-number" style={{ color: 'var(--neon-gold)' }}>03</span>
                <span className="arena-stars">★★★</span>
              </div>
              <div className="arena-icon-box">
                <Icon icon={Icons.lightbulb} size={42} color="#ffd166" />
              </div>
              <h3 className="arena-title">Logic Labs</h3>
              <p className="arena-desc">
                Circuit routing, flow sequences, and cause-and-effect puzzles that foster early algorithmic thinking.
              </p>
              <button className="arena-btn btn-gold">
                <span>Solve Lab</span>
                <Icon icon={Icons.puzzle} size={16} />
              </button>
            </div>

            {/* Card 4: Pattern Pals */}
            <div className="arena-card card-cyan" onclick="window.switchArcadeTab('pattern')">
              <div className="arena-card-top">
                <span className="arena-number">04</span>
                <span className="arena-stars">★★★</span>
              </div>
              <div className="arena-icon-box">
                <Icon icon={Icons.shapes} size={42} color="#00f0ff" />
              </div>
              <h3 className="arena-title">Pattern Pals</h3>
              <p className="arena-desc">
                Discover recurring geometric symmetry, rotating shapes, and spatial sequences that make geometry delightful.
              </p>
              <button className="arena-btn btn-cyan">
                <span>Match Pattern</span>
                <Icon icon={Icons.shapes} size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Playable Mini-Arcade Sandbox */}
          <div className="playable-arcade-box" id="arcade-sandbox">
            <div className="arcade-box-header">
              <div className="badge-pill">
                <Icon icon={Icons.videogameAsset} size={16} color="#00f0ff" />
                <span>Interactive Live Sandbox</span>
              </div>
              <h3 className="arcade-box-title text-gradient-cyan">Test-Drive the Quests Right Here! 🚀</h3>
            </div>

            <div className="arcade-inner-tabs">
              <button className="arcade-subtab active" id="tabQuizBtn" onclick="window.switchArcadeTab('quiz')">
                <Icon icon={Icons.quiz} size={16} />
                <span>Quiz Whiz</span>
              </button>
              <button className="arcade-subtab tab-pink" id="tabMemoryBtn" onclick="window.switchArcadeTab('memory')">
                <Icon icon={Icons.brain} size={16} />
                <span>Memory Match</span>
              </button>
              <button className="arcade-subtab tab-gold" id="tabPatternBtn" onclick="window.switchArcadeTab('pattern')">
                <Icon icon={Icons.shapes} size={16} />
                <span>Pattern Pals</span>
              </button>
            </div>

            {/* Panel 1: Quiz Whiz */}
            <div className="mini-game-panel active" id="panelQuiz">
              <div className="quiz-game-box">
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" id="quizProgressBar"></div>
                </div>

                <div className="quiz-question-card">
                  <div className="quiz-step-tag">
                    <span id="quizStepNumber">QUESTION 1 OF 3</span> • COSMIC SCIENCE & RIDDLES
                  </div>
                  <h4 className="quiz-question-text" id="quizQuestionTitle">
                    Which planet in our solar system is famous for having giant glowing icy rings?
                  </h4>

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
                <h4 className="game-subheading">Galactic Memory Pair Quest 🧠✨</h4>
                <p className="game-instruction">
                  Tap two cards to find matching cosmic brain symbols. Match them all to earn a galactic star!
                </p>

                <div className="memory-grid" id="memoryGrid">
                  {/* Generated dynamically by script */}
                </div>

                <div className="quiz-feedback" id="memoryFeedback"></div>
              </div>
            </div>

            {/* Panel 3: Pattern Pals */}
            <div className="mini-game-panel" id="panelPattern">
              <div className="quiz-game-box">
                <h4 className="game-subheading">Pattern Pals: Complete the Sequence 🧩</h4>
                <p className="game-instruction">
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
        </section>

        {/* ========================================================= */}
        {/* TAB PANEL 3: STAR JOURNEY & RIDDLES                        */}
        {/* ========================================================= */}
        <section className="tab-panel" id="panel-journey">
          <div className="section-head-box">
            <span className="section-tag">Constellation Road Map</span>
            <h2 className="section-heading text-gradient-cosmic">Your Journey: Level 1 — Galaxy Maze 🌌</h2>
            <p className="section-subtext">
              Kids travel through a personalized cosmic progression path. Every challenge solved illuminates star coordinates!
            </p>
          </div>

          {/* Constellation Journey Map */}
          <div className="constellation-board">
            <div className="journey-track-header">
              <div className="track-step-info">
                <span className="step-badge">CURRENT CHECKPOINT</span>
                <h4>Level 1: The Nebula Gates</h4>
              </div>
              <div className="track-badge-points">
                <Icon icon={Icons.star} size={18} color="#ffd166" />
                <span>350 / 500 XP to Level 2</span>
              </div>
            </div>

            {/* Responsive Constellation SVG Map */}
            <div className="constellation-map-wrap">
              <svg className="constellation-large-svg" viewBox="0 0 900 140">
                <path
                  d="M 50 70 Q 180 15, 300 80 T 550 45 T 750 90 T 850 50"
                  fill="none"
                  stroke="rgba(0, 240, 255, 0.4)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                />
                {/* Node 1: Completed */}
                <circle cx="50" cy="70" r="14" fill="#00f0ff" filter="drop-shadow(0 0 10px #00f0ff)" />
                <text x="50" y="115" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">1. Stardust</text>
                
                {/* Node 2: Completed */}
                <circle cx="180" cy="35" r="14" fill="#9d4edd" filter="drop-shadow(0 0 10px #9d4edd)" />
                <text x="180" y="18" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">2. Moon Riddles</text>

                {/* Node 3: Current Node */}
                <circle cx="300" cy="80" r="18" fill="#ff2a85" filter="drop-shadow(0 0 16px #ff2a85)" />
                <circle cx="300" cy="80" r="26" fill="none" stroke="#ff2a85" strokeWidth="2.5">
                  <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="300" y="125" textAnchor="middle" fill="#ff2a85" fontSize="13" fontWeight="800">3. Galaxy Maze (Active)</text>

                {/* Node 4: Locked */}
                <circle cx="550" cy="45" r="14" fill="#1b2559" stroke="#00f0ff" strokeWidth="2" />
                <text x="550" y="25" textAnchor="middle" fill="#9aa8cf" fontSize="12">4. Saturn Rings</text>

                {/* Node 5: Locked */}
                <circle cx="750" cy="90" r="14" fill="#1b2559" stroke="#9d4edd" strokeWidth="2" />
                <text x="750" y="130" textAnchor="middle" fill="#9aa8cf" fontSize="12">5. Quantum Lab</text>

                {/* Node 6: Trophy Boss */}
                <circle cx="850" cy="50" r="20" fill="#ffd166" filter="drop-shadow(0 0 18px #ffd166)" />
                <text x="850" y="25" textAnchor="middle" fill="#ffd166" fontSize="13" fontWeight="800">👑 Supernova Sage</text>
              </svg>
            </div>
          </div>

          {/* Riddle Quest Special Banner */}
          <div className="riddle-quest-feature-banner" onclick="window.triggerChestAnimation()">
            <div className="riddle-banner-content">
              <div className="badge-pill" style={{ borderColor: 'var(--neon-gold)', color: 'var(--neon-gold)' }}>
                <Icon icon={Icons.treasureChest} size={16} color="#ffd166" />
                <span>Story Quest Adventure</span>
              </div>
              <h3 className="riddle-headline text-gradient-gold">Riddle Quest: Unlock Ancient Cosmic Chests! ✨</h3>
              <p className="riddle-subline">
                Decode witty space riddles, solve galactic mysteries, and tap the glowing chest to reveal astronaut badges and secret stardust lore.
              </p>
              <div className="riddle-cta-chip">
                <span>Tap Chest to Open ➔</span>
              </div>
            </div>
            <div className="riddle-chest-visual">
              <div className="chest-floating-container">
                <div className="chest-glow-ring"></div>
                <Icon icon={Icons.treasureChest} size={76} color="#ffd166" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TAB PANEL 4: INCLUSIVE & SENSORY PLAY                      */}
        {/* ========================================================= */}
        <section className="tab-panel" id="panel-inclusive">
          <div className="section-head-box">
            <span className="section-tag">Special Needs & Inclusive Design</span>
            <h2 className="section-heading">
              Every Child Deserves to <span className="text-gradient-cyan">Shine in Space</span> 🌟
            </h2>
            <p className="section-subtext">
              Built from the ground up to be sensory-friendly and neurodiverse-welcoming with guidance from pediatric occupational therapists.
            </p>
          </div>

          <div className="inclusive-grid">
            <div className="inclusive-info-card">
              <h3 className="card-inner-title text-gradient-cyan">Adaptive Pacing & Calm Visuals</h3>
              <p className="card-inner-text">
                Traditional educational apps frequently induce anxiety with frantic countdown timers and sudden loud buzzer sounds. Neon Activities replaces pressure with soothing reinforcement, intuitive tactile guidance, and adaptable pacing.
              </p>

              <div className="inclusive-pills-wrap">
                <span className="inclusive-pill">✨ Calm Sensory Palette</span>
                <span className="inclusive-pill">⏱️ Zero-Timer Mode</span>
                <span className="inclusive-pill">📖 Dyslexia-Friendly Typography</span>
                <span className="inclusive-pill">🔊 Full Audio Narration</span>
                <span className="inclusive-pill">🖐️ Large Single-Finger Targets</span>
              </div>
            </div>

            {/* Interactive Adaptive Mode Simulator */}
            <div className="inclusive-interactive-card">
              <div className="badge-pill" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                <Icon icon={Icons.inclusiveHands} size={16} color="#ff2a85" />
                <span>Live Assistive Simulator</span>
              </div>
              <h4 className="simulator-title">Test Assistive Modes</h4>
              <p className="simulator-subtitle">Toggle real assistive modes built right into the app engine:</p>

              <div className="inclusive-modes-list">
                <div className="mode-toggle-item" onclick="window.toggleMode(this, 'Sensory Calm')">
                  <div>
                    <span className="mode-name">Sensory Calm Mode</span>
                    <span className="mode-desc">Softens glow effects and slows down animations</span>
                  </div>
                  <div className="mode-toggle-switch"></div>
                </div>

                <div className="mode-toggle-item" onclick="window.toggleMode(this, 'No-Rush Pacing')">
                  <div>
                    <span className="mode-name">No-Rush Relaxed Pacing</span>
                    <span className="mode-desc">Disables all timed challenges completely</span>
                  </div>
                  <div className="mode-toggle-switch"></div>
                </div>

                <div className="mode-toggle-item" onclick="window.toggleMode(this, 'Voice Guided Narration')">
                  <div>
                    <span className="mode-name">Voice Guided Narration</span>
                    <span className="mode-desc">Reads out question text and hints aloud</span>
                  </div>
                  <div className="mode-toggle-switch"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TAB PANEL 5: PARENT HUB, SAFETY & DOWNLOAD                 */}
        {/* ========================================================= */}
        <section className="tab-panel" id="panel-parents">
          <div className="section-head-box">
            <span className="section-tag">Parent Mission Control</span>
            <h2 className="section-heading text-gradient-cyan">100% Kid-Safe, Ad-Free & Stress-Free</h2>
            <p className="section-subtext">
              Guilt-free screen time that genuinely educates. COPPA compliant and 100% free of external advertising.
            </p>
          </div>

          {/* Safety Cards Grid */}
          <div className="safety-grid">
            <div className="safety-card">
              <div className="safety-icon-wrap">🛡️</div>
              <h3 className="safety-card-title">Zero Ads & Third-Party Trackers</h3>
              <p className="safety-card-text">
                Certified COPPA and GDPR-K compliant. No external links, banner ads, or unexpected in-app surprises.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon-wrap">📊</div>
              <h3 className="safety-card-title">Cognitive Growth Insights</h3>
              <p className="safety-card-text">
                Parents receive weekly reports on skills exercised (working memory, logic, vocabulary) without test anxiety.
              </p>
            </div>

            <div className="safety-card">
              <div className="safety-icon-wrap">✈️</div>
              <h3 className="safety-card-title">100% Offline Exploration</h3>
              <p className="safety-card-text">
                Download packs for flights, road trips, and offline fun. Never get stranded without entertainment!
              </p>
            </div>
          </div>

          {/* Reviews & Testimonials */}
          <div className="reviews-cockpit-box">
            <h3 className="cockpit-subheading text-gradient-gold">Loved by 50,000+ Families & Teachers ⭐</h3>
            
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
                    <div className="reviewer-role">Special Ed Specialist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="faq-box" id="faq">
            <h3 className="cockpit-subheading">Frequently Asked Questions</h3>

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
            </div>
          </div>

          {/* Download App CTA Card */}
          <div className="download-app-card" id="download">
            <div className="badge-pill">
              <Icon icon={Icons.sparkles} size={16} />
              <span>Ready for Launch</span>
            </div>
            <h3 className="download-title">Start Your Child’s Cosmic Adventure Today! 🚀</h3>
            <p className="download-desc">
              Join hundreds of thousands of young explorers learning through memory puzzles, riddle quests, and logic challenges.
            </p>

            <div className="cta-badges-row">
              <a href="#" className="store-badge" onclick="alert('Neon Activities for iOS is coming to the App Store soon! 🎉'); return false;">
                <Icon icon={Icons.apple} size={26} color="#fff" />
                <div className="store-badge-text">
                  <span className="badge-text-sub">Download on the</span>
                  <span className="badge-text-main">App Store</span>
                </div>
              </a>

              <a href="#" className="store-badge" onclick="alert('Neon Activities for Android is coming to Google Play soon! 🎉'); return false;">
                <Icon icon={Icons.googlePlay} size={26} color="#00f0ff" />
                <div className="store-badge-text">
                  <span className="badge-text-sub">Get it on</span>
                  <span className="badge-text-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on < 768px screens) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button 
          className="mob-nav-btn active" 
          id="mobNav-hq" 
          data-tab="hq" 
          onclick="window.switchMainTab('hq')"
        >
          <Icon icon={Icons.rocketLaunch} size={20} />
          <span>HQ</span>
        </button>

        <button 
          className="mob-nav-btn" 
          id="mobNav-games" 
          data-tab="games" 
          onclick="window.switchMainTab('games')"
        >
          <Icon icon={Icons.gamepad} size={20} />
          <span>Arenas</span>
        </button>

        <button 
          className="mob-nav-btn" 
          id="mobNav-journey" 
          data-tab="journey" 
          onclick="window.switchMainTab('journey')"
        >
          <Icon icon={Icons.star} size={20} />
          <span>Journey</span>
        </button>

        <button 
          className="mob-nav-btn" 
          id="mobNav-inclusive" 
          data-tab="inclusive" 
          onclick="window.switchMainTab('inclusive')"
        >
          <Icon icon={Icons.inclusiveHands} size={20} />
          <span>Inclusive</span>
        </button>

        <button 
          className="mob-nav-btn" 
          id="mobNav-parents" 
          data-tab="parents" 
          onclick="window.switchMainTab('parents')"
        >
          <Icon icon={Icons.shieldCheck} size={20} />
          <span>Parents</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo-link">
              <img src="/logo.png" alt="Neon Activities Logo" className="footer-logo-img" />
              <div className="logo-text">
                <span className="logo-title">NEON <span>ACTIVITIES</span></span>
              </div>
            </div>
            <p className="footer-tagline">
              The cosmic playground where cognitive growth, joyful exploration, and inclusive learning unite in radiant neon light.
            </p>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Neon Activities HQ. All Rights Reserved.</span>
            <span>Designed for Curious Explorers Across the Universe 🌌</span>
          </div>
        </div>
      </footer>

      {/* Embedded Client-Side Script */}
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
            const STAR_COUNT = Math.min(Math.floor(width * 0.1), 100);

            for (let i = 0; i < STAR_COUNT; i++) {
              stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.4,
                alpha: Math.random() * 0.7 + 0.15,
                twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                color: Math.random() > 0.7 ? '#7ee7c9' : (Math.random() > 0.5 ? '#c084fc' : '#ffffff')
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
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
              } else if (type === 'wrong') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
              } else if (type === 'flip') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
              } else if (type === 'chest') {
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
          // Primary Cosmic Tab Switcher (Desktop + Mobile)
          // ==========================================
          const TAB_NAMES = ['hq', 'games', 'journey', 'inclusive', 'parents'];

          window.switchMainTab = function(tabName) {
            if (!TAB_NAMES.includes(tabName)) tabName = 'hq';

            // Update Desktop Tab Buttons
            TAB_NAMES.forEach(function(name) {
              const deskBtn = document.getElementById('tabNav-' + name);
              const mobBtn = document.getElementById('mobNav-' + name);
              const panel = document.getElementById('panel-' + name);

              if (deskBtn) deskBtn.classList.toggle('active', name === tabName);
              if (mobBtn) mobBtn.classList.toggle('active', name === tabName);
              if (panel) panel.classList.toggle('active', name === tabName);
            });

            // Scroll to top of app container smoothly on tab switch
            const appContainer = document.querySelector('.cosmic-app-container');
            if (appContainer) {
              const topPos = appContainer.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
            }

            playSynthSound('flip');
          };

          // ==========================================
          // Slide-out Navigation Drawer Handlers
          // ==========================================
          window.openDrawer = function() {
            const drawer = document.getElementById('navDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
            playSynthSound('flip');
          };

          window.closeDrawer = function() {
            const drawer = document.getElementById('navDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            document.body.style.overflow = '';
            playSynthSound('flip');
          };

          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              window.closeDrawer();
              window.closeAuthModal();
            }
          });

          // ==========================================
          // Better Auth Client-Side OTP Modal Handlers
          // ==========================================
          let authCurrentEmail = '';

          window.openAuthModal = function() {
            const modal = document.getElementById('authModal');
            const backdrop = document.getElementById('authModalBackdrop');
            if (modal) modal.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
            playSynthSound('flip');
            const emailInput = document.getElementById('authEmailInput');
            if (emailInput) setTimeout(function() { emailInput.focus(); }, 100);
          };

          window.closeAuthModal = function() {
            const modal = document.getElementById('authModal');
            const backdrop = document.getElementById('authModalBackdrop');
            if (modal) modal.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            document.body.style.overflow = '';
            playSynthSound('flip');
          };

          window.backToEmailStep = function() {
            const emailForm = document.getElementById('authEmailForm');
            const otpForm = document.getElementById('authOtpForm');
            const statusMsg = document.getElementById('authStatusMsg');
            if (emailForm) emailForm.style.display = 'block';
            if (otpForm) otpForm.style.display = 'none';
            if (statusMsg) statusMsg.innerHTML = '';
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
              if (otpForm) otpForm.style.display = 'block';
              if (targetEmailEl) targetEmailEl.textContent = email;
              if (statusMsg) statusMsg.innerHTML = '<span class="status-success">✨ Cosmic code sent! Check your inbox.</span>';

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

              if (statusMsg) statusMsg.innerHTML = '<span class="status-success">🎉 Blast off! You are signed in as ' + authCurrentEmail + '!</span>';
              playSynthSound('chest');

              const userNameEl = document.getElementById('headerUserName');
              const userSubEl = document.getElementById('headerUserSub');
              if (userNameEl) userNameEl.textContent = authCurrentEmail.split('@')[0] + ' 🧑‍🚀';
              if (userSubEl) userSubEl.textContent = 'Explorer';

              setTimeout(function() {
                window.closeAuthModal();
              }, 1800);
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
            const progressFill = document.getElementById('quizProgressBar');
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

          // Arcade sub-tab switch
          window.switchArcadeTab = function(subtabName) {
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

            const current = tabs[subtabName] || tabs.quiz;
            const currentBtn = document.getElementById(current.btn);
            const currentPanel = document.getElementById(current.panel);
            if (currentBtn) currentBtn.classList.add('active');
            if (currentPanel) currentPanel.classList.add('active');
            playSynthSound('flip');
          };

          // Riddle Chest trigger
          window.triggerChestAnimation = function() {
            playSynthSound('chest');
            alert('✨ Riddle Quest Unlocked! "I have rings but no fingers, I spin in the night. What am I?" (Answer: Saturn! 🪐)');
          };

          // Assistive Mode Toggle helper
          window.toggleMode = function(itemEl, modeName) {
            const switchEl = itemEl.querySelector('.mode-toggle-switch');
            if (switchEl) {
              switchEl.classList.toggle('active');
              const isActive = switchEl.classList.contains('active');
              playSynthSound('flip');
              if (modeName === 'Sensory Calm') {
                document.body.classList.toggle('sensory-calm-active', isActive);
              }
            }
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
