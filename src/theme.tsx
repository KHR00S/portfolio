import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  /** origin is the point the circular wipe grows from (usually the toggle) */
  toggle: (origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'theme'

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function applyToDocument(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  /* keep the browser chrome in step with a manual choice */
  const bg = theme === 'dark' ? '#0a2026' : '#edf2ee'
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => (m.content = bg))
}

/* index.html sets data-theme before first paint, so we start from that */
function initialTheme(): Theme {
  const fromDom = document.documentElement.dataset.theme
  if (fromDom === 'light' || fromDom === 'dark') return fromDom
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  /* follow the OS setting until the visitor picks a theme themselves */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      if (readStored()) return
      const next: Theme = e.matches ? 'light' : 'dark'
      applyToDocument(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback<ThemeContextValue['toggle']>((origin) => {
    const next: Theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    const commit = () => {
      applyToDocument(next)
      flushSync(() => setTheme(next))
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* private mode: the choice just won't persist */
      }
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      commit()
      return
    }
    const root = document.documentElement
    if (origin) {
      root.style.setProperty('--vt-x', `${origin.x}px`)
      root.style.setProperty('--vt-y', `${origin.y}px`)
    }
    document.startViewTransition(commit)
  }, [])

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
