import React from 'react'

const MODEL_COLORS = {
  gemini: '#4285f4',
  groq: '#f97316',
  mistral: '#ec4899',
}

export default function Sidebar({ history, onSelect, onClear, currentQuery, user, onLoginClick, onLogoutClick }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>History</span>
        {history.length > 0 && (
          <button style={styles.clearBtn} onClick={onClear} title="Clear history">
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={styles.empty}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: 8 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No queries yet</p>
        </div>
      ) : (
        <ul style={styles.list}>
          {history.map(entry => (
            <li
              key={entry.id}
              style={{
                ...styles.item,
                background: entry.query === currentQuery ? 'var(--bg-glass-hover)' : 'transparent',
                borderColor: entry.query === currentQuery ? 'var(--border-accent)' : 'transparent',
              }}
              onClick={() => onSelect(entry.query)}
            >
              <div style={styles.itemQuery}>{entry.query}</div>
              <div style={styles.itemMeta}>
                <div style={styles.modelDots}>
                  {entry.models.map(m => (
                    <span
                      key={m}
                      title={m}
                      style={{ ...styles.dot, background: MODEL_COLORS[m] || '#888' }}
                    />
                  ))}
                </div>
                <span style={styles.time}>{entry.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* User Section at Bottom */}
      <div style={styles.userSection}>
        {user ? (
          <div style={styles.userMenu}>
            <div style={styles.userInfo}>
              <div style={styles.avatar}>{user.charAt(0).toUpperCase()}</div>
              <span style={styles.username}>{user}</span>
            </div>
            <button style={styles.logoutBtn} onClick={onLogoutClick} title="Log out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        ) : (
          <button style={styles.loginBtn} onClick={onLoginClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Sign In / Sign Up
          </button>
        )}
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 240,
    minWidth: 240,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 16px 14px',
    borderBottom: '1px solid var(--border)',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 4,
    transition: 'color 0.2s',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 24,
  },
  list: {
    listStyle: 'none',
    overflowY: 'auto',
    flex: 1,
    padding: '8px 8px',
  },
  item: {
    padding: '10px 10px',
    borderRadius: 8,
    border: '1px solid',
    cursor: 'pointer',
    marginBottom: 4,
    transition: 'all 0.15s ease',
  },
  itemQuery: {
    fontSize: 13,
    color: 'var(--text-primary)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: 6,
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelDots: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    display: 'inline-block',
  },
  time: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  userSection: {
    padding: '16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  username: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
