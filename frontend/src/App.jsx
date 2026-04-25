import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import QueryInput from './components/QueryInput'
import ResponseCard from './components/ResponseCard'
import SummaryPanel from './components/SummaryPanel'
import LoginModal from './components/LoginModal'
import { useTheme } from './hooks/useTheme'
import { useHistory } from './hooks/useHistory'
import { askModels, logout } from './api'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  // Auth State (must be defined before useHistory)
  const [user, setUser] = useState(localStorage.getItem('arena_user') || null)
  const [showLogin, setShowLogin] = useState(false)

  const { history, addEntry, clearHistory } = useHistory(user)

  const [page, setPage] = useState('landing') // 'landing' | 'app'
  const [query, setQuery] = useState('')
  const [responses, setResponses] = useState(null)   // { gemini: {...}, groq: {...}, ... }
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeModels, setActiveModels] = useState([])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    clearHistory()
    setQuery('')
    setResponses(null)
    setSummary('')
  }

  const handleSubmit = async (q, models) => {
    setQuery(q)
    setActiveModels(models)
    setIsLoading(true)
    setError(null)
    setResponses(null)
    setSummary('')

    try {
      const data = await askModels(q, models)
      setResponses(data.responses)
      setSummary(data.summary)
      addEntry(q, models)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistorySelect = (q) => {
    setQuery(q)
    // Optionally re-run the query:
    // handleSubmit(q, activeModels.length ? activeModels : ['gemini', 'groq', 'mistral'])
  }

  if (page === 'landing') {
    return <LandingPage onStart={() => setPage('app')} />
  }

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <Sidebar
        history={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
        currentQuery={query}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main area */}
      <div style={styles.main}>
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogoClick={() => setPage('landing')}
        />

        <div style={styles.content}>
          {/* Query input */}
          <div style={styles.inputSection}>
            <QueryInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              initialQuery={query}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBanner}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div style={styles.cards}>
              {activeModels.map(m => (
                <SkeletonCard key={m} modelId={m} />
              ))}
            </div>
          )}

          {/* Responses */}
          {responses && !isLoading && (
            <>
              <div style={{
                ...styles.cards,
                gridTemplateColumns: `repeat(${Math.min(Object.keys(responses).length, 3)}, 1fr)`
              }}>
                {Object.entries(responses).map(([modelId, data], i) => (
                  <ResponseCard
                    key={modelId}
                    modelId={modelId}
                    data={data}
                    delay={i * 120}
                  />
                ))}
              </div>

              <SummaryPanel
                summary={summary}
                visible={!!summary}
              />
            </>
          )}

          {/* Empty state */}
          {!responses && !isLoading && !error && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🧠</div>
              <p style={styles.emptyTitle}>Ready to compare</p>
              <p style={styles.emptySubtitle}>
                Type your question above and select the AI models you want to pit against each other.
              </p>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={(username) => {
            setUser(username)
            setQuery('')
            setResponses(null)
            setSummary('')
          }} 
        />
      )}
    </div>
  )
}

// Skeleton loading card
function SkeletonCard({ modelId }) {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonHeader}>
        <div style={{ ...styles.skeletonBlock, width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <div style={{ ...styles.skeletonBlock, width: '50%', height: 14 }} />
          <div style={{ ...styles.skeletonBlock, width: '35%', height: 11 }} />
        </div>
      </div>
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[100, 85, 92, 70].map((w, i) => (
          <div key={i} style={{ ...styles.skeletonBlock, width: `${w}%`, height: 13 }} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '32px 28px',
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  inputSection: {
    position: 'relative',
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    alignItems: 'start',
  },
  skeleton: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  skeletonHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 18px 14px',
  },
  skeletonBlock: {
    background: 'var(--bg-glass)',
    borderRadius: 4,
    backgroundImage: 'linear-gradient(90deg, var(--bg-glass) 0%, var(--bg-glass-hover) 50%, var(--bg-glass) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease infinite',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
  },
  emptySubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    maxWidth: 420,
    lineHeight: 1.7,
    fontWeight: 300,
  },
}
