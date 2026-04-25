import React from 'react'

export default function Header({ theme, onToggleTheme, onLogoClick }) {
  const isDark = theme === 'dark'

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={onLogoClick} title="Back to home">
        <span style={styles.logoMark}>⬡</span>
        <span style={styles.logoText}>AI Arena</span>
      </div>

      <div style={styles.right}>
        <div style={styles.statusPill}>
          <span style={styles.statusDot} />
          3 models ready
        </div>

        {/* Theme toggle */}
        <button style={styles.themeBtn} onClick={onToggleTheme} title="Toggle theme">
          {isDark ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 56,
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(12px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoMark: {
    fontSize: 22,
    color: 'var(--accent-cyan)',
    filter: 'drop-shadow(0 0 6px var(--accent-cyan))',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1rem',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-secondary)',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    padding: '5px 12px',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px var(--accent-green)',
  },
  themeBtn: {
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '7px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
}
