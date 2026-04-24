'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

const readStoredTheme = (): Theme | null => {
  try {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    return themeIsValid(preference) ? preference : null
  } catch {
    return null
  }
}

const writeStoredTheme = (themeToSet: Theme | null) => {
  try {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
    } else {
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
    }
  } catch {
    // no-op
  }
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      writeStoredTheme(null)
      const implicitPreference = getImplicitPreference()
      const resolvedTheme = implicitPreference || defaultTheme
      document.documentElement.setAttribute('data-theme', resolvedTheme)
      setThemeState(resolvedTheme)
    } else {
      setThemeState(themeToSet)
      writeStoredTheme(themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = readStoredTheme()

    if (preference) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
