import React, { useState } from 'react'

const MODELS = [
  { id: 'gemini', label: 'Gemini', icon: '✦', color: '#4285f4', desc: 'Google' },
  { id: 'groq',   label: 'Groq',   icon: '◈', color: '#f97316', desc: 'LLaMA' },
  { id: 'mistral',label: 'Mistral',icon: '◉', color: '#ec4899', desc: 'EU AI' },
]

export default function QueryInput({ onSubmit, isLoading, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [selected, setSelected] = useState(['gemini', 'groq', 'mistral'])

  // Sync if parent pushes a new query (from history click or auth reset)
  React.useEffect(() => {
    setQuery(initialQuery || '')
  }, [initialQuery])

  const toggleModel = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim() || selected.length === 0 || isLoading) return
    onSubmit(query.trim(), selected)
  }

  const canSubmit = query.trim().length > 0 && selected.length > 0 && !isLoading

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Query input */}
        <div style={styles.inputRow}>
          <div style={styles.inputWrap}>
            <svg style={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything — compare how AIs respond..."
              style={styles.input}
              disabled={isLoading}
              autoFocus
            />
            {query && (
              <button type="button" style={styles.clearInput} onClick={() => setQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Model selection + submit */}
        <div style={styles.bottomRow}>
          <div style={styles.modelRow}>
            <span style={styles.modelLabel}>Models:</span>
            {MODELS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleModel(m.id)}
                style={{
                  ...styles.modelToggle,
                  borderColor: selected.includes(m.id) ? m.color : 'var(--border)',
                  background: selected.includes(m.id) ? m.color + '18' : 'var(--bg-glass)',
                  color: selected.includes(m.id) ? m.color : 'var(--text-secondary)',
                }}
              >
                <span>{m.icon}</span>
                {m.label}
                {selected.includes(m.id) && (
                  <span style={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>

          <button type="submit" disabled={!canSubmit} style={{
            ...styles.submitBtn,
            opacity: canSubmit ? 1 : 0.5,
          }}>
            {isLoading ? (
              <>
                <span style={styles.spinner} />
                Asking...
              </>
            ) : (
              <>
                Compare
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {selected.length === 0 && (
        <p style={styles.warning}>Select at least one model to compare.</p>
      )}
    </div>
  )
}

const styles = {
  wrap: {
    width: '100%',
    maxWidth: 860,
    margin: '0 auto',
  },
  form: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '4px',
    boxShadow: 'var(--shadow-card)',
    backdropFilter: 'blur(12px)',
  },
  inputRow: {
    display: 'flex',
  },
  inputWrap: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '16px 44px 16px 48px',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    width: '100%',
  },
  clearInput: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 18,
    padding: '0 4px',
    lineHeight: 1,
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px 8px',
    borderTop: '1px solid var(--border)',
    gap: 12,
    flexWrap: 'wrap',
  },
  modelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  modelLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  modelToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    border: '1px solid',
    borderRadius: 100,
    padding: '5px 12px',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s ease',
    fontFamily: 'var(--font-body)',
  },
  checkmark: {
    fontSize: 11,
    marginLeft: 2,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    borderRadius: 100,
    padding: '9px 22px',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(0,0,0,0.3)',
    borderTopColor: '#000',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  warning: {
    fontSize: 12,
    color: 'var(--accent-amber)',
    marginTop: 8,
    textAlign: 'center',
  },
}
