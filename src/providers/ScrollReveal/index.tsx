'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { getBottomTriggerOffsetPx, scrollRevealConfig } from './config'

const HEADING_SELECTOR =
  '#site-content h1:not(.sr-only), #site-content h2:not(.sr-only), #site-content h3:not(.sr-only), #site-content h4:not(.sr-only), #site-content h5:not(.sr-only), #site-content h6:not(.sr-only)'
const TEXT_SELECTOR =
  '#site-content p:not(.sr-only):not([data-sr-timer="true"]), #site-content li:not(.sr-only), #site-content blockquote, #site-content figcaption'
const MEDIA_SELECTOR =
  '#site-content img:not([aria-hidden="true"]):not([data-sr-ignore="true"]), #site-content video:not([aria-hidden="true"]):not([data-sr-ignore="true"]), #site-content figure:not([data-sr-ignore="true"])'
const TIMER_SELECTOR = '#site-content [data-sr-timer="true"]'

type ScrollRevealInstance = {
  destroy: () => void
  reveal: (target: string, options?: Record<string, unknown>) => void
  sync: () => void
}

export const ScrollRevealProvider = () => {
  const pathname = usePathname()
  const scrollRevealRef = useRef<ScrollRevealInstance | null>(null)

  useEffect(() => {
    let isCancelled = false

    const initScrollReveal = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const { default: ScrollReveal } = await import('scrollreveal')
      if (isCancelled) return

      if (!scrollRevealRef.current) {
        const bottomTriggerOffsetPx = getBottomTriggerOffsetPx(window.innerWidth)

        scrollRevealRef.current = ScrollReveal({
          mobile: true,
          reset: false,
          viewFactor: 0.12,
          viewOffset: {
            ...scrollRevealConfig.baseViewOffset,
            bottom: bottomTriggerOffsetPx,
          },
        })
      }

      const sr = scrollRevealRef.current
      if (!sr) return

      sr.reveal(HEADING_SELECTOR, {
        delay: scrollRevealConfig.delayMs,
        distance: '32px',
        duration: 900,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        interval: 80,
        opacity: 0,
        origin: 'bottom',
      })

      sr.reveal(TEXT_SELECTOR, {
        delay: scrollRevealConfig.delayMs,
        distance: '20px',
        duration: 820,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        interval: 40,
        opacity: 0,
        origin: 'bottom',
      })

      sr.reveal(MEDIA_SELECTOR, {
        delay: scrollRevealConfig.delayMs,
        distance: '28px',
        duration: 940,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: 0,
        origin: 'bottom',
        scale: 0.97,
      })

      // Keep the large countdown timer without added delay.
      sr.reveal(TIMER_SELECTOR, {
        distance: '20px',
        duration: 820,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        interval: 40,
        opacity: 0,
        origin: 'bottom',
      })

      // Optional per-element overrides for future usage in specific sections.
      sr.reveal('[data-sr="left"]', {
        delay: scrollRevealConfig.delayMs,
        distance: '36px',
        duration: 900,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: 0,
        origin: 'left',
      })
      sr.reveal('[data-sr="right"]', {
        delay: scrollRevealConfig.delayMs,
        distance: '36px',
        duration: 900,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: 0,
        origin: 'right',
      })

      requestAnimationFrame(() => {
        sr.sync()
      })
    }

    initScrollReveal()

    return () => {
      isCancelled = true
    }
  }, [pathname])

  useEffect(() => {
    return () => {
      scrollRevealRef.current?.destroy()
      scrollRevealRef.current = null
    }
  }, [])

  return null
}
