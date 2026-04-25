const API_BASE = 'http://localhost:5000'

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('arena_token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function askModels(query, models) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ query, models })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Login failed')
  }
  return res.json()
}

export async function signup(username, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Signup failed')
  }
  return res.json()
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getHeaders()
  }).catch(() => {})
  localStorage.removeItem('arena_token')
  localStorage.removeItem('arena_user')
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}
