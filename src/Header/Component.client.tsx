'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 h-20 transition-colors duration-200 ${
        isScrolled
          ? 'bg-palette-1 shadow-lg'
          : 'bg-[linear-gradient(to_bottom,rgba(0,0,0,0.40),rgba(0,0,0,0))]'
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link aria-label="Accueil" href="/">
          <Logo
            loading="eager"
            priority="high"
            src={isScrolled ? '/images/logo-tamahana.png' : '/svgs/logo-tamahana.svg'}
            className="h-11 w-auto max-w-none "
          />
        </Link>
        <HeaderNav data={data} isScrolled={isScrolled} />
      </div>
    </header>
  )
}
