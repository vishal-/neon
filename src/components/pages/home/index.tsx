import { useState, useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'
import { Header } from '../../common'

interface LatestQuizMeta {
  id: string
  title: string
  slug: string
  description?: string
  category: string
  difficulty: string
  timeLimitSeconds: number
  rewardXp: number
  questionCount: number
}

interface QuizQuestionItem {
  question: string
  options: string[]
  correct: number
  fact: string
}

const quizQuestions: QuizQuestionItem[] = [
  {
    question: 'Which planet in our solar system is famous for having giant glowing icy rings?',
    options: ['Mars 🔴', 'Saturn 🪐', 'Jupiter 🌪️', 'Neptune 🌊'],
    correct: 1,
    fact: 'Awesome! Saturn has thousands of beautiful rings made of ice, rock, and stardust! 🌟',
  },
  {
    question: 'What keeps all the planets orbiting around the Sun without flying away?',
    options: ['Solar Wind 💨', 'Magnetic Dust 🧲', 'Gravity 🌌', 'Cosmic Glue 🪄'],
    correct: 2,
    fact: 'Spot on! Gravity is the invisible cosmic pull that keeps planets in their galaxy tracks! 🚀',
  },
  {
    question: 'Which astronaut vehicle is built to explore the bumpy surface of the Moon or Mars?',
    options: ['Space Rover 🚜', 'Galaxy Submarine 🚢', 'Jet Hoverboard 🛹', 'Helicopter 🚁'],
    correct: 0,
    fact: 'Brilliant explorer! Rovers like Curiosity and Perseverance roll across red Martian dunes! 🤖',
  },
]

interface MemoryCardItem {
  id: number
  icon: string
  matched: boolean
}

const initialMemoryCards: MemoryCardItem[] = [
  { id: 1, icon: '🧠', matched: false },
  { id: 2, icon: '🚀', matched: false },
  { id: 3, icon: '🧠', matched: false },
  { id: 4, icon: '🚀', matched: false },
]

export const HomePage: FC = () => {
  const [activeTab, setActiveTab] = useState<'hq' | 'games' | 'journey' | 'parents'>('hq')
  const [activeArcadeTab, setActiveArcadeTab] = useState<'quiz' | 'memory' | 'pattern'>('quiz')

  // Dynamic Latest Quiz State
  const [latestQuiz, setLatestQuiz] = useState<LatestQuizMeta | null>(null)

  useEffect(() => {
    fetch('/api/quizzes/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quiz) {
          setLatestQuiz(data.quiz)
        }
      })
      .catch((err) => console.error('Failed to load latest quiz mission:', err))
  }, [])

  // Quiz Whiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizAnsweredIndex, setQuizAnsweredIndex] = useState<number | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>(initialMemoryCards)
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [memoryWin, setMemoryWin] = useState(false)

  // Pattern Game State
  const [patternChoice, setPatternChoice] = useState<string | null>(null)
  const [patternSuccess, setPatternSuccess] = useState<boolean | null>(null)

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Quiz Handler
  const handleQuizAnswer = (selectedIndex: number) => {
    if (quizAnsweredIndex !== null) return
    setQuizAnsweredIndex(selectedIndex)

    const q = quizQuestions[currentQuizIndex]
    const isCorrect = selectedIndex === q.correct

    if (isCorrect) {
      setQuizFeedback(`✨ Correct! ${q.fact}`)
    } else {
      setQuizFeedback('Almost! Try the next question! ⭐')
    }

    setTimeout(() => {
      setCurrentQuizIndex((prev) => (prev + 1) % quizQuestions.length)
      setQuizAnsweredIndex(null)
      setQuizFeedback(null)
    }, 2200)
  }

  // Memory Card Flip Handler
  const handleCardFlip = (index: number) => {
    if (flippedIndices.length >= 2 || memoryCards[index].matched || flippedIndices.includes(index)) {
      return
    }

    const nextFlipped = [...flippedIndices, index]
    setFlippedIndices(nextFlipped)

    if (nextFlipped.length === 2) {
      const first = memoryCards[nextFlipped[0]]
      const second = memoryCards[nextFlipped[1]]

      if (first.icon === second.icon) {
        setMemoryCards((prev) =>
          prev.map((c, idx) => (nextFlipped.includes(idx) ? { ...c, matched: true } : c))
        )
        setFlippedIndices([])

        // Check win
        const allMatched = memoryCards.filter((c) => c.matched).length + 2 >= memoryCards.length
        if (allMatched) {
          setMemoryWin(true)
          setTimeout(() => {
            setMemoryCards(initialMemoryCards)
            setMemoryWin(false)
          }, 3000)
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([])
        }, 900)
      }
    }
  }

  // Pattern Handler
  const handlePatternChoice = (choice: string, isCorrect: boolean) => {
    setPatternChoice(choice)
    setPatternSuccess(isCorrect)
  }

  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab as any)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentQ = quizQuestions[currentQuizIndex]

  return (
    <div className="page-wrapper">
      {/* Background Starfield and Nebulas */}
      <div className="cosmic-nebula-1"></div>
      <div className="cosmic-nebula-2"></div>
      <div className="cosmic-nebula-3"></div>

      {/* Global Top Header */}
      <Header onSwitchTab={handleSwitchTab} activeTab={activeTab} />

      {/* Central App Shell */}
      <main className="cosmic-app-container">
        {/* ========================================================= */}
        {/* TAB PANEL 1: HQ & DAILY QUEST (HERO + VORTEX)              */}
        {/* ========================================================= */}
        {activeTab === 'hq' && (
          <section className="tab-panel active" id="panel-hq">
            {/* User Profile & Mission Status Card */}
            <div className="explorer-profile-card">
              <div className="profile-left">
                <div className="avatar-ring">
                  <Icon icon={Icons.astronautNoto} size={36} />
                </div>
                <div className="profile-meta">
                  <div className="user-greeting">Welcome back, Cadet Explorer! 🧑‍🚀</div>
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
                Where Curious Minds <span className="text-gradient-cyan">Solve</span>,{' '}
                <span className="text-gradient-cosmic">Explore</span> & Conquer the Cosmos! 🚀
              </h1>

              <p className="hero-description">
                Turn screen time into a thrilling galactic journey. Daily logic labs, memory pair quests, astronomy
                trivia, and fun space adventures crafted for growing young minds.
              </p>

              <div className="hero-action-buttons">
                <button className="btn-primary" onClick={() => handleSwitchTab('games')}>
                  <span>Play Live Arenas</span>
                  <Icon icon={Icons.gamepad} size={20} />
                </button>
                <button className="btn-secondary" onClick={() => handleSwitchTab('journey')}>
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

            {/* Today's Featured Cosmic Quest Challenge */}
            <div className="spotlight-challenge-card" id="daily-challenge">
              <div className="challenge-header">
                <div className="challenge-tag-row">
                  <span className="challenge-tag">TODAY'S FEATURED QUEST</span>
                  <div className="stars-glow-row">★★★</div>
                </div>
                <span className="reward-badge">+{latestQuiz ? latestQuiz.rewardXp : 150} XP</span>
              </div>

              <h3 className="challenge-main-title text-uppercase">
                {latestQuiz ? latestQuiz.title : 'COSMIC TRIVIA MISSION'}
              </h3>
              <p className="challenge-desc">
                {latestQuiz?.description ||
                  'Test your knowledge across planets, history, geography, and science to level up your cadet rank!'}
              </p>

              {/* Dynamic Meta Chips */}
              {latestQuiz && (
                <div className="d-flex flex-wrap gap-2 my-2 align-items-center">
                  <span className="badge text-bg-primary text-uppercase px-2 py-1">
                    {latestQuiz.category}
                  </span>
                  <span
                    className={`badge px-2 py-1 text-capitalize ${
                      latestQuiz.difficulty === 'easy'
                        ? 'text-bg-success'
                        : latestQuiz.difficulty === 'hard'
                        ? 'text-bg-danger'
                        : 'text-bg-warning'
                    }`}
                  >
                    {latestQuiz.difficulty} Tier
                  </span>
                  <span className="badge text-bg-secondary px-2 py-1">
                    ⏱ {Math.round((latestQuiz.timeLimitSeconds || 300) / 60)} Mins
                  </span>
                  <span className="badge text-bg-secondary px-2 py-1">
                    ❓ {latestQuiz.questionCount} Questions
                  </span>
                </div>
              )}

              <div className="galaxy-vortex-visual">
                <div className="vortex-core"></div>
                <div className="vortex-rings"></div>
                <div className="vortex-planet p-1" title="Saturn">🪐</div>
                <div className="vortex-planet p-2" title="Star">⭐</div>
                <div className="vortex-planet p-3" title="Rocket">🚀</div>
              </div>

              <div className="challenge-action-wrap d-flex flex-column gap-2">
                <Link
                  to={latestQuiz ? `/quiz/${latestQuiz.slug}` : '/quizzes'}
                  className="btn-primary full-width d-flex justify-content-center align-items-center gap-2 text-decoration-none"
                >
                  <span>Launch Today's Quest</span>
                  <Icon icon={Icons.rocketLaunch} size={18} />
                </Link>
                <Link
                  to="/quizzes"
                  className="text-info text-decoration-none text-center small fw-semibold py-1"
                >
                  Browse all galactic quizzes →
                </Link>
              </div>
            </div>

            {/* Quick Launch Cards Preview */}
            <div className="quick-access-strip">
              <h4 className="strip-title">Jump to Mission Arenas</h4>
              <div className="quick-access-grid">
                <div
                  className="access-chip chip-cyan"
                  onClick={() => {
                    handleSwitchTab('games')
                    setActiveArcadeTab('memory')
                  }}
                >
                  <Icon icon={Icons.brain} size={22} color="#7ee7c9" />
                  <span>Memory Match</span>
                </div>
                <div
                  className="access-chip chip-pink"
                  onClick={() => {
                    handleSwitchTab('games')
                    setActiveArcadeTab('quiz')
                  }}
                >
                  <Icon icon={Icons.quiz} size={22} color="#c084fc" />
                  <span>Quiz Whiz</span>
                </div>
                <div
                  className="access-chip chip-gold"
                  onClick={() => {
                    handleSwitchTab('games')
                    setActiveArcadeTab('pattern')
                  }}
                >
                  <Icon icon={Icons.shapes} size={22} color="#fcd34d" />
                  <span>Pattern Pals</span>
                </div>
                <div className="access-chip chip-purple" onClick={() => handleSwitchTab('journey')}>
                  <Icon icon={Icons.treasureChest} size={22} color="#a78bfa" />
                  <span>Riddle Quest</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB PANEL 2: GAME ARENAS & INTERACTIVE SANDBOX             */}
        {/* ========================================================= */}
        {activeTab === 'games' && (
          <section className="tab-panel active" id="panel-games">
            <div className="section-head-box">
              <span className="section-tag">Central Command</span>
              <h2 className="section-heading text-gradient-cyan">Brain Quest HQ: 4 Core Arenas 🎮</h2>
              <p className="section-subtext">
                Jump directly into the flagship activity modules crafted for memory, logic deduction, and spatial mastery.
              </p>
            </div>

            {/* 4 Core Game Cards Grid */}
            <div className="games-grid">
              <div className="arena-card card-cyan" onClick={() => setActiveArcadeTab('memory')}>
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

              <div className="arena-card card-pink" onClick={() => setActiveArcadeTab('quiz')}>
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

              <div className="arena-card card-gold" onClick={() => setActiveArcadeTab('quiz')}>
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

              <div className="arena-card card-cyan" onClick={() => setActiveArcadeTab('pattern')}>
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
                <button
                  className={`arcade-subtab ${activeArcadeTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setActiveArcadeTab('quiz')}
                >
                  <Icon icon={Icons.quiz} size={16} />
                  <span>Quiz Whiz</span>
                </button>
                <button
                  className={`arcade-subtab tab-pink ${activeArcadeTab === 'memory' ? 'active' : ''}`}
                  onClick={() => setActiveArcadeTab('memory')}
                >
                  <Icon icon={Icons.brain} size={16} />
                  <span>Memory Match</span>
                </button>
                <button
                  className={`arcade-subtab tab-gold ${activeArcadeTab === 'pattern' ? 'active' : ''}`}
                  onClick={() => setActiveArcadeTab('pattern')}
                >
                  <Icon icon={Icons.shapes} size={16} />
                  <span>Pattern Pals</span>
                </button>
              </div>

              {/* Panel 1: Quiz Whiz */}
              {activeArcadeTab === 'quiz' && (
                <div className="mini-game-panel active" id="panelQuiz">
                  <div className="quiz-game-box">
                    <div className="quiz-progress-bar">
                      <div
                        className="quiz-progress-fill"
                        style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>

                    <div className="quiz-question-card">
                      <div className="quiz-step-tag">
                        <span>QUESTION {currentQuizIndex + 1} OF {quizQuestions.length}</span> • COSMIC SCIENCE & RIDDLES
                      </div>
                      <h4 className="quiz-question-text">{currentQ.question}</h4>

                      <div className="quiz-options-grid">
                        {currentQ.options.map((optText, index) => {
                          let btnClass = 'quiz-opt-btn'
                          if (quizAnsweredIndex !== null) {
                            if (index === currentQ.correct) btnClass += ' correct'
                            else if (index === quizAnsweredIndex) btnClass += ' wrong'
                          }

                          return (
                            <button
                              key={index}
                              className={btnClass}
                              onClick={() => handleQuizAnswer(index)}
                              disabled={quizAnsweredIndex !== null}
                            >
                              <span style={{ color: 'var(--neon-cyan)', fontWeight: 800 }}>
                                {String.fromCharCode(65 + index)}.
                              </span>{' '}
                              {optText}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {quizFeedback && (
                      <div className="quiz-feedback">
                        <span
                          style={{
                            color: quizFeedback.startsWith('✨') ? 'var(--neon-green)' : '#ff4d6d',
                          }}
                        >
                          {quizFeedback}
                        </span>
                      </div>
                    )}

                    {/* Directory Quick-link Banner */}
                    <div className="mt-3 p-3 bg-dark bg-opacity-75 border border-info border-opacity-25 rounded-3 d-flex align-items-center justify-content-between gap-3 flex-wrap">
                      <div className="small text-light">
                        🚀 Ready for full-length timed missions with XP rewards?
                      </div>
                      <Link
                        to="/quizzes"
                        className="btn btn-outline-info btn-sm fw-bold d-inline-flex align-items-center gap-1 text-decoration-none"
                      >
                        <span>Browse All Quizzes</span>
                        <Icon icon={Icons.sparkles} size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel 2: Memory Match */}
              {activeArcadeTab === 'memory' && (
                <div className="mini-game-panel active" id="panelMemory">
                  <div className="quiz-game-box">
                    <h4 className="game-subheading">Galactic Memory Pair Quest 🧠✨</h4>
                    <p className="game-instruction">
                      Tap two cards to find matching cosmic brain symbols. Match them all to earn a galactic star!
                    </p>

                    <div className="memory-grid">
                      {memoryCards.map((card, idx) => {
                        const isFlipped = card.matched || flippedIndices.includes(idx)
                        return (
                          <div
                            key={idx}
                            className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                            onClick={() => handleCardFlip(idx)}
                          >
                            <div className="memory-inner">
                              <div className="memory-front">❓</div>
                              <div className="memory-back">{card.icon}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {memoryWin && (
                      <div className="quiz-feedback">
                        <span style={{ color: 'var(--neon-gold)', textShadow: '0 0 10px var(--neon-gold-glow)' }}>
                          🎉 Stellar Memory! You matched all pairs! (Restarting...)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Panel 3: Pattern Pals */}
              {activeArcadeTab === 'pattern' && (
                <div className="mini-game-panel active" id="panelPattern">
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
                      <div
                        className="pattern-item pattern-slot-target"
                        style={{
                          borderColor:
                            patternSuccess === true
                              ? 'var(--neon-green)'
                              : patternSuccess === false
                              ? '#ff4d6d'
                              : undefined,
                          boxShadow:
                            patternSuccess === true
                              ? '0 0 20px var(--neon-green-glow)'
                              : patternSuccess === false
                              ? '0 0 16px rgba(255, 77, 109, 0.6)'
                              : undefined,
                        }}
                        title="Missing Shape"
                      >
                        {patternChoice || '❓'}
                      </div>
                    </div>

                    <div className="pattern-choices">
                      <button className="pattern-choice-btn" onClick={() => handlePatternChoice('⭐', false)}>
                        ⭐
                      </button>
                      <button className="pattern-choice-btn" onClick={() => handlePatternChoice('🔵', true)}>
                        🔵
                      </button>
                      <button className="pattern-choice-btn" onClick={() => handlePatternChoice('🔺', false)}>
                        🔺
                      </button>
                      <button className="pattern-choice-btn" onClick={() => handlePatternChoice('🚀', false)}>
                        🚀
                      </button>
                    </div>

                    {patternSuccess !== null && (
                      <div className="quiz-feedback">
                        {patternSuccess ? (
                          <span style={{ color: 'var(--neon-green)', textShadow: '0 0 10px var(--neon-green-glow)' }}>
                            ✨ Pattern Complete! Circle ➡️ Gear ➡️ Circle ➡️ Gear ➡️ Circle! ⭐
                          </span>
                        ) : (
                          <span style={{ color: '#ff4d6d' }}>
                            Not quite! Look at the alternation: 🔵 ⚙️ 🔵 ⚙️ ?
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB PANEL 3: STAR JOURNEY & RIDDLES                        */}
        {/* ========================================================= */}
        {activeTab === 'journey' && (
          <section className="tab-panel active" id="panel-journey">
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
                  <circle cx="50" cy="70" r="14" fill="#00f0ff" filter="drop-shadow(0 0 10px #00f0ff)" />
                  <text x="50" y="115" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">1. Stardust</text>

                  <circle cx="180" cy="35" r="14" fill="#9d4edd" filter="drop-shadow(0 0 10px #9d4edd)" />
                  <text x="180" y="18" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">2. Moon Riddles</text>

                  <circle cx="300" cy="80" r="18" fill="#ff2a85" filter="drop-shadow(0 0 16px #ff2a85)" />
                  <text x="300" y="125" textAnchor="middle" fill="#ff2a85" fontSize="13" fontWeight="800">3. Galaxy Maze (Active)</text>

                  <circle cx="550" cy="45" r="14" fill="#1b2559" stroke="#00f0ff" strokeWidth="2" />
                  <text x="550" y="25" textAnchor="middle" fill="#9aa8cf" fontSize="12">4. Saturn Rings</text>

                  <circle cx="750" cy="90" r="14" fill="#1b2559" stroke="#9d4edd" strokeWidth="2" />
                  <text x="750" y="130" textAnchor="middle" fill="#9aa8cf" fontSize="12">5. Quantum Lab</text>

                  <circle cx="850" cy="50" r="20" fill="#ffd166" filter="drop-shadow(0 0 18px #ffd166)" />
                  <text x="850" y="25" textAnchor="middle" fill="#ffd166" fontSize="13" fontWeight="800">👑 Supernova Sage</text>
                </svg>
              </div>
            </div>

            {/* Riddle Quest Special Banner */}
            <div
              className="riddle-quest-feature-banner"
              onClick={() => alert('✨ Riddle Quest Unlocked! "I have rings but no fingers, I spin in the night. What am I?" (Answer: Saturn! 🪐)')}
            >
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
        )}

        {/* ========================================================= */}
        {/* TAB PANEL 4: PARENT HUB, SAFETY & DOWNLOAD                 */}
        {/* ========================================================= */}
        {activeTab === 'parents' && (
          <section className="tab-panel active" id="panel-parents">
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
                    "As a teacher, finding educational games that keep kids engaged without commercial distractions is rare. Neon Activities nailed it!"
                  </p>
                  <div className="reviewer-meta">
                    <div className="reviewer-avatar">⭐</div>
                    <div>
                      <div className="reviewer-name">Marcus Sterling</div>
                      <div className="reviewer-role">STEM Educator</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="faq-box" id="faq">
              <h3 className="cockpit-subheading">Frequently Asked Questions</h3>

              <div className="faq-list">
                {[
                  {
                    q: 'What age group is Neon Activities designed for?',
                    a: 'Neon Activities features adaptive difficulty tiers tailored for young explorers ages 4 to 12. Puzzles and quiz questions automatically adjust as your child masters skills.',
                  },
                  {
                    q: 'Is the app safe for kids to use independently?',
                    a: 'Yes, absolutely! Neon Activities is 100% ad-free, COPPA certified, contains no external chat, and includes a secure parental gate for any subscription settings.',
                  },
                  {
                    q: 'Can multiple kids have their own astronaut profiles?',
                    a: 'Yes! You can create up to 4 distinct explorer profiles with custom astronaut avatars, individualized constellation progression paths, and personalized star counters.',
                  },
                ].map((faqItem, idx) => (
                  <div
                    key={idx}
                    className={`faq-item ${openFaq === idx ? 'active' : ''}`}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <button className="faq-question">
                      <span>{faqItem.q}</span>
                      <span className="faq-icon">{openFaq === idx ? '▲' : '▼'}</span>
                    </button>
                    {openFaq === idx && <div className="faq-answer">{faqItem.a}</div>}
                  </div>
                ))}
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
                <a
                  href="#"
                  className="store-badge"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Neon Activities for iOS is coming to the App Store soon! 🎉')
                  }}
                >
                  <Icon icon={Icons.apple} size={26} color="#fff" />
                  <div className="store-badge-text">
                    <span className="badge-text-sub">Download on the</span>
                    <span className="badge-text-main">App Store</span>
                  </div>
                </a>

                <a
                  href="#"
                  className="store-badge"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Neon Activities for Android is coming to Google Play soon! 🎉')
                  }}
                >
                  <Icon icon={Icons.googlePlay} size={26} color="#00f0ff" />
                  <div className="store-badge-text">
                    <span className="badge-text-sub">Get it on</span>
                    <span className="badge-text-main">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on < 768px screens) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          className={`mob-nav-btn ${activeTab === 'hq' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('hq')}
        >
          <Icon icon={Icons.rocketLaunch} size={20} />
          <span>HQ</span>
        </button>

        <button
          className={`mob-nav-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('games')}
        >
          <Icon icon={Icons.gamepad} size={20} />
          <span>Arenas</span>
        </button>

        <button
          className={`mob-nav-btn ${activeTab === 'journey' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('journey')}
        >
          <Icon icon={Icons.star} size={20} />
          <span>Journey</span>
        </button>

        <button
          className={`mob-nav-btn ${activeTab === 'parents' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('parents')}
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
                <span className="logo-title">
                  NEON <span>ACTIVITIES</span>
                </span>
              </div>
            </div>
            <p className="footer-tagline">
              The cosmic playground where cognitive growth, joyful exploration, and logic learning unite in radiant neon light.
            </p>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Neon Activities HQ. All Rights Reserved.</span>
            <span>Designed for Curious Explorers Across the Universe 🌌</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

