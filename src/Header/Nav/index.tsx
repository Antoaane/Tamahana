'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType; isScrolled?: boolean }> = ({
  data,
  isScrolled = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileNavRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const hasNavItems = navItems.length > 0
  const navColorClass = isScrolled ? 'text-palette-3' : 'text-palette-1'
  const navHoverClass = isScrolled ? 'hover:text-palette-3/85' : 'hover:text-palette-1/85'
  const mobilePanelClass =
    'border-palette-4/45 bg-palette-1/97 text-palette-3 shadow-[0_20px_45px_rgba(68,59,43,0.14)]'

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      if (mobileNavRef.current?.contains(target) && target.closest('a')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [isMobileMenuOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 48rem)')
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleViewportChange)
    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [])

  if (!hasNavItems) {
    return null
  }

  return (
    <div className="relative flex items-center">
      <nav
        aria-label="Navigation principale"
        className={`hidden items-center gap-6 font-baskervville md:flex md:gap-8 ${navColorClass}`}
      >
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

      <button
        aria-controls="mobile-site-nav"
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        className={`relative inline-flex size-11 items-center justify-center transition-opacity focus-visible:outline-none focus-visible:ring-2 md:hidden ${isScrolled ? 'text-palette-3 hover:opacity-75 focus-visible:ring-palette-3/45' : 'text-palette-1 hover:opacity-80 focus-visible:ring-palette-1/65'}`}
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        type="button"
      >
        <span className="relative block h-4 w-6">
          <span
            aria-hidden
            className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-[top,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0 translate-y-0 rotate-0'}`}
          />
          <span
            aria-hidden
            className={`absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rounded-full bg-current transition-[opacity,transform] duration-200 ease-out ${isMobileMenuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'}`}
          />
          <span
            aria-hidden
            className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-[bottom,top,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0 translate-y-0 rotate-0'}`}
          />
        </span>
      </button>

      <button
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 top-20 z-30 bg-black/20 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsMobileMenuOpen(false)}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        type="button"
      />

      <nav
        aria-label="Navigation mobile"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-x-0 top-20 z-40 origin-top border-t px-6 py-6 backdrop-blur-md transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${mobilePanelClass} ${isMobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
        id="mobile-site-nav"
        ref={mobileNavRef}
      >
        <ul className="mx-auto flex w-full max-w-[36rem] flex-col divide-y divide-palette-4/35">
          {navItems.map(({ link }, i) => {
            return (
              <li key={i}>
                <CMSLink
                  {...link}
                  appearance="link"
                  className="block w-full py-4 text-center font-baskervville text-2xl text-palette-3 transition-opacity hover:opacity-70"
                />
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
