import { useState, useEffect } from 'react'
import { fetchHistory } from '../api'

export function useHistory(user) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (user) {
      fetchHistory().then(data => {
        // Backend returns [{ query, models, responses, timestamp }]
        const formatted = data.history.map((h, i) => ({
          id: i, // simple id since backend sorts by time desc
          query: h.query,
          models: h.models,
          responses: h.responses,
          timestamp: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
        setHistory(formatted)
      }).catch(err => console.error("History fetch error:", err))
    } else {
      setHistory([])
    }
  }, [user])

  const addEntry = (query, models) => {
    const entry = {
      id: Date.now(),
      query,
      models,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setHistory(prev => [entry, ...prev].slice(0, 50))
    return entry
  }

  const clearHistory = () => setHistory([])

  return { history, setHistory, addEntry, clearHistory }
}
