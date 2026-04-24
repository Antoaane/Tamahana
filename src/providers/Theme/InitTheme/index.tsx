import Script from 'next/script'

import { defaultTheme, themeLocalStorageKey } from '../shared'

const INIT_THEME_SCRIPT = `
  (function () {
    var themeToSet = '${defaultTheme}'

    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    function getImplicitPreference() {
      try {
        if (typeof window.matchMedia !== 'function') {
          return null
        }

        var mediaQuery = '(prefers-color-scheme: dark)'
        var mql = window.matchMedia(mediaQuery)
        if (typeof mql.matches === 'boolean') {
          return mql.matches ? 'dark' : 'light'
        }
      } catch (_) {
        return null
      }

      return null
    }

    try {
      var preference = null
      try {
        preference = window.localStorage.getItem('${themeLocalStorageKey}')
      } catch (_) {
        preference = null
      }

      if (themeIsValid(preference)) {
        themeToSet = preference
      } else {
        var implicitPreference = getImplicitPreference()
        if (implicitPreference) {
          themeToSet = implicitPreference
        }
      }
    } catch (_) {
      // no-op
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
`

export const InitTheme = () => {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {INIT_THEME_SCRIPT}
    </Script>
  )
}
