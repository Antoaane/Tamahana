'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType; isScrolled?: boolean }> = ({
  data,
  isScrolled = false,
}) => {
  const navItems = data?.navItems || []
  const navColorClass = isScrolled ? 'text-palette-3' : 'text-palette-1'
  const navHoverClass = isScrolled ? 'hover:text-palette-3/85' : 'hover:text-palette-1/85'

  return (
    <nav className={`flex items-center gap-6 font-baskervville md:gap-8 ${navColorClass}`}>
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={`${navColorClass} ${navHoverClass} text-lg`}
          />
        )
      })}
    </nav>
  )
}
