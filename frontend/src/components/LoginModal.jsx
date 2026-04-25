import React, { useState } from 'react'
import { login, signup } from '../api'

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let data
      if (isLogin) {
        data = await login(username, password)
      } else {
        data = await signup(username, password)
      }
      localStorage.setItem('arena_token', data.token)
      localStorage.setItem('arena_user', data.username)
      onLoginSuccess(data.username)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <div style={styles.header}>
          <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p>{isLogin ? 'Log in to sync your AI history.' : 'Sign up to keep track of your AI comparisons.'}</p>
        </div>
        
        <div style={styles.tabs}>
          <button 
            style={isLogin ? styles.activeTab : styles.tab} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button 
            style={!isLogin ? styles.activeTab : styles.tab} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'var(--bg-primary)',
    width: '100%',
    maxWidth: 400,
    borderRadius: '12px',
    border: '1px solid var(--border)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: 1,
  },
  header: {
    padding: '32px 32px 16px',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    flex: 1,
    padding: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 500,
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    flex: 1,
    padding: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    borderBottom: '2px solid var(--accent)',
  },
  form: {
    padding: '24px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
  },
  submitBtn: {
    padding: '14px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
  }
}
