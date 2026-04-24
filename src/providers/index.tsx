import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { RevealProvider } from './Reveal'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <RevealProvider />
        {children}
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
