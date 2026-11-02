import { useCallback, useEffect, useState } from 'react'
import type { Action, AppState, Progress } from './types'
import { seed } from './seed'

const KEY = 'momentum:v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* storage unavailable or corrupt: fall back to sample data */
  }
  return seed()
}

/**
 * Local-only storage for the prototype. Data lives in this browser on this device.
 * Swap for a synced backend (e.g. Firebase/Supabase) before relying on it across phone + desktop.
 */
export function useStore() {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const setProgress = useCallback((id: string, progress: Progress) => {
    setState((s) => ({
      ...s,
      actions: s.actions.map((a: Action) => (a.id === id ? { ...a, progress } : a)),
    }))
  }, [])

  const reset = useCallback(() => setState(seed()), [])

  return { state, setProgress, reset }
}
