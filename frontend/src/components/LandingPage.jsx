import React, { useEffect, useState } from 'react'

const words = ['Intelligences.', 'Perspectives.', 'Answers.']

export default function LandingPage({ onStart }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    // Cycle through words
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.wrap}>
      {/* Background grid lines */}
      <div style={styles.grid} aria-hidden="true" />

      <div style={{ ...styles.content, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Multi-model AI Comparison
        </div>

        {/* Headline */}
        <h1 style={styles.headline}>
          One Question.
          <br />
          <span style={styles.headlineAlt}>
            Multiple{' '}
            <span style={styles.wordCycle} key={wordIndex}>
              {words[wordIndex]}
            </span>
          </span>
        </h1>

        <p style={styles.subtitle}>
          Ask once. Get answers from Gemini, Groq, and Mistral side-by-side.<br />
          Then see what they agree on.
        </p>

        {/* CTA */}
        <button style={styles.cta} onClick={onStart}>
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Model logos row */}
        <div style={styles.models}>
          {[
            { name: 'Gemini', color: '#4285f4', icon: '✦' },
            { name: 'Groq', color: '#f97316', icon: '◈' },
            { name: 'Mistral', color: '#ec4899', icon: '◉' },
          ].map(m => (
            <div key={m.name} style={{ ...styles.modelChip, borderColor: m.color + '40', color: m.color }}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              {m.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--bg-primary)',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
  },
  content: {
    textAlign: 'center',
    maxWidth: 680,
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    padding: '6px 16px',
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginBottom: 32,
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.02em',
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--accent-green)',
    display: 'inline-block',
    boxShadow: '0 0 8px var(--accent-green)',
    animation: 'pulse-glow 2s ease infinite',
  },
  headline: {
    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    marginBottom: 24,
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
  },
  headlineAlt: {
    color: 'var(--accent-cyan)',
  },
  wordCycle: {
    display: 'inline-block',
    animation: 'fadeSlideUp 0.4s ease forwards',
    color: 'var(--accent-violet)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginBottom: 40,
    lineHeight: 1.7,
    fontWeight: 300,
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    borderRadius: 100,
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
    marginBottom: 48,
  },
  models: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  modelChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    border: '1px solid',
    borderRadius: 100,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    background: 'var(--bg-glass)',
  },
}
