import React, { useEffect, useState } from 'react'

export default function SummaryPanel({ summary, visible: shouldShow }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (shouldShow) {
      const t = setTimeout(() => setVisible(true), 400) // Appear after cards
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [shouldShow])

  if (!shouldShow) return null

  return (
    <div style={{
      ...styles.wrap,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.sparkle}>⚡</span>
          Final Verdict
        </div>
        <div style={styles.badge}>AI Synthesized</div>
      </div>

      <div style={styles.divider} />

      <div style={styles.body}>
        {summary.split('\n').map((line, i) => {
          if (!line.trim()) return <br key={i} />

          // Bold markdown: **text**
          const parts = line.split(/\*\*(.*?)\*\*/g)
          return (
            <p key={i} style={line.startsWith('##') ? styles.h2 : styles.para}>
              {line.startsWith('##') ? line.replace('## ', '') :
                parts.map((part, j) =>
                  j % 2 === 1
                    ? <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part}</strong>
                    : part
                )
              }
            </p>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-accent)',
    borderRadius: 'var(--radius)',
    backdropFilter: 'blur(12px)',
    boxShadow: 'var(--shadow-glow)',
    overflow: 'hidden',
    marginTop: 8,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 14px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.05rem',
    color: 'var(--accent-cyan)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '-0.01em',
  },
  sparkle: {
    fontSize: 18,
  },
  badge: {
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 100,
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--accent-cyan)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    letterSpacing: '0.05em',
    fontWeight: 500,
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), transparent)',
    opacity: 0.4,
  },
  body: {
    padding: '18px 20px 20px',
  },
  h2: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--text-primary)',
    marginBottom: 12,
    display: 'none', // Hide the ## heading since we show "Final Verdict" in header
  },
  para: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.75,
    marginBottom: 8,
    fontWeight: 300,
  },
}
