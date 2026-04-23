import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ScrollRevealProvider } from './ScrollReveal'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <ScrollRevealProvider />
        {children}
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
