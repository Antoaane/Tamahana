import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

export const getImplicitPreference = (): Theme | null => {
  try {
    if (typeof window.matchMedia !== 'function') {
      return null
    }

    const mediaQuery = '(prefers-color-scheme: dark)'
    const mql = window.matchMedia(mediaQuery)
    if (typeof mql.matches === 'boolean') {
      return mql.matches ? 'dark' : 'light'
    }
  } catch {
    return null
  }

  return null
}
