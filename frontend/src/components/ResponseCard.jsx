import React, { useEffect, useState } from 'react'

const MODEL_META = {
  gemini:  { label: 'Gemini',  icon: '✦', color: '#4285f4', company: 'Google DeepMind' },
  groq:    { label: 'Groq',    icon: '◈', color: '#f97316', company: 'Groq / Meta LLaMA' },
  mistral: { label: 'Mistral', icon: '◉', color: '#ec4899', company: 'Mistral AI' },
}

export default function ResponseCard({ modelId, data, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const meta = MODEL_META[modelId] || { label: modelId, icon: '◆', color: '#888', company: '' }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{
      ...styles.card,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 0.45s ease ${delay}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      borderColor: data?.error ? 'rgba(239,68,68,0.3)' : 'var(--border)',
    }}>
      {/* Card header */}
      <div style={styles.header}>
        <div style={styles.identity}>
          <div style={{ ...styles.iconBadge, background: meta.color + '20', color: meta.color, boxShadow: `0 0 12px ${meta.color}30` }}>
            {meta.icon}
          </div>
          <div>
            <div style={{ ...styles.modelName, color: meta.color }}>{meta.label}</div>
            <div style={styles.company}>{meta.company}</div>
          </div>
        </div>

        {data?.error ? (
          <span style={styles.errorBadge}>Error</span>
        ) : (
          <span style={{ ...styles.statusDot, background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
        )}
      </div>

      {/* Divider */}
      <div style={{ ...styles.divider, background: `linear-gradient(90deg, ${meta.color}40, transparent)` }} />

      {/* Content */}
      <div style={styles.body}>
        {data?.error ? (
          <div style={styles.errorMsg}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span>{data.error}</span>
          </div>
        ) : (
          <p style={styles.text}>{data?.text || '...'}</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px 14px',
  },
  identity: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  modelName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: '-0.01em',
  },
  company: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  errorBadge: {
    fontSize: 11,
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    padding: '3px 9px',
    borderRadius: 100,
    border: '1px solid rgba(239,68,68,0.3)',
  },
  divider: {
    height: 1,
    marginBottom: 0,
  },
  body: {
    padding: '16px 18px 18px',
    flex: 1,
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    fontWeight: 300,
  },
  errorMsg: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    color: '#f87171',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
}
