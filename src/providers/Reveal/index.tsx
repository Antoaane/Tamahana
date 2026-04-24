'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { getBottomTriggerOffsetPxFromVh, getHeroDelayMs, revealConfig } from './config'

const HEADING_SELECTOR =
  '#site-content h1:not(.sr-only):not([data-sr-hero-item="true"]), #site-content h2:not(.sr-only):not([data-sr-hero-item="true"]), #site-content h3:not(.sr-only):not([data-sr-hero-item="true"]), #site-content h4:not(.sr-only):not([data-sr-hero-item="true"]), #site-content h5:not(.sr-only):not([data-sr-hero-item="true"]), #site-content h6:not(.sr-only):not([data-sr-hero-item="true"])'
const TEXT_SELECTOR =
  '#site-content p:not(.sr-only):not([data-sr-timer="true"]):not([data-sr-hero-item="true"]), #site-content li:not(.sr-only):not([data-sr-hero-item="true"]), #site-content blockquote:not([data-sr-hero-item="true"]), #site-content figcaption:not([data-sr-hero-item="true"])'
const MEDIA_SELECTOR =
  '#site-content img:not([aria-hidden="true"]):not([data-sr-ignore="true"]), #site-content video:not([aria-hidden="true"]):not([data-sr-ignore="true"]), #site-content figure:not([data-sr-ignore="true"])'
const TIMER_SELECTOR = '#site-content [data-sr-timer="true"]'
const HERO_SELECTOR = '#site-content [data-sr-hero-item="true"]'
const LEFT_SELECTOR = '#site-content [data-sr="left"]'
const RIGHT_SELECTOR = '#site-content [data-sr="right"]'

const GSAP_REVEAL_ATTRIBUTE = 'data-gsap-reveal'
const FALLBACK_VIEWPORT_BUFFER_PX = 160
const FAILSAFE_REVEAL_TIMEOUT_MS = 2600
const FAILSAFE_FORCE_ALL_TIMEOUT_MS = 1200
const SYNC_DEBOUNCE_MS = 120
const DEFERRED_SYNC_DELAYS_MS = [120, 360, 900, 1800] as const

type RevealOrigin = 'bottom' | 'left' | 'right'

type RevealDefinition = {
  selector: string
  delayMs: number
  distancePx: number
  durationMs: number
  easing: string
  intervalMs?: number
  origin: RevealOrigin
  scale?: number
  bottomOffsetPx: number
}

type RevealController = {
  destroy: () => void
  sync: () => void
}

const clearRevealInlineStyles = (elements: Iterable<HTMLElement>) => {
  let clearedCount = 0

  for (const element of elements) {
    const inlineStyle = element.style
    if (!inlineStyle) continue

    const parsedOpacity = Number.parseFloat(inlineStyle.opacity)
    const isHiddenByReveal =
      inlineStyle.visibility === 'hidden' ||
      (Number.isFinite(parsedOpacity) && parsedOpacity <= 0.01)
    if (!isHiddenByReveal) continue

    clearedCount += 1
    inlineStyle.removeProperty('opacity')
    inlineStyle.removeProperty('visibility')
    inlineStyle.removeProperty('transform')
    inlineStyle.removeProperty('-webkit-transform')
    inlineStyle.removeProperty('transition')
    inlineStyle.removeProperty('-webkit-transition')
    inlineStyle.removeProperty('will-change')

    if (!element.getAttribute('style')?.trim()) {
      element.removeAttribute('style')
    }
  }

  return clearedCount
}

const forceRevealFailSafe = (scope: 'viewport' | 'all') => {
  const revealElements = Array.from(
    document.querySelectorAll<HTMLElement>(`#site-content [${GSAP_REVEAL_ATTRIBUTE}="true"]`),
  )
  if (!revealElements.length) return 0

  if (scope === 'all') {
    return clearRevealInlineStyles(revealElements)
  }

  const viewportTop = -FALLBACK_VIEWPORT_BUFFER_PX
  const viewportBottom = window.innerHeight + FALLBACK_VIEWPORT_BUFFER_PX

  const inViewportElements = revealElements.filter((element) => {
    const rect = element.getBoundingClientRect()
    return rect.bottom >= viewportTop && rect.top <= viewportBottom
  })

  return clearRevealInlineStyles(inViewportElements)
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)

const getAxisStart = (origin: RevealOrigin, distancePx: number) => {
  if (origin === 'left') {
    return { x: -distancePx, y: 0 }
  }

  if (origin === 'right') {
    return { x: distancePx, y: 0 }
  }

  return { x: 0, y: distancePx }
}

const getTriggerStartPx = (element: HTMLElement, bottomOffsetPx: number) => {
  const viewportHeight = window.innerHeight
  const viewportTop = revealConfig.baseViewOffset.top
  const viewportBottom = viewportHeight - bottomOffsetPx
  const revealLine = viewportBottom - element.getBoundingClientRect().height * revealConfig.viewFactor

  return clamp(Math.round(revealLine), viewportTop, viewportBottom)
}

const buildRevealDefinitions = (): RevealDefinition[] => {
  const bottomTriggerOffsetPx = getBottomTriggerOffsetPxFromVh(window.innerHeight)
  const heroDelayMs = getHeroDelayMs()

  return [
    {
      selector: HEADING_SELECTOR,
      delayMs: revealConfig.delayMs,
      distancePx: 32,
      durationMs: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      intervalMs: 80,
      origin: 'bottom',
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: TEXT_SELECTOR,
      delayMs: revealConfig.delayMs,
      distancePx: 20,
      durationMs: 820,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      intervalMs: 40,
      origin: 'bottom',
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: MEDIA_SELECTOR,
      delayMs: revealConfig.delayMs,
      distancePx: 28,
      durationMs: 940,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      origin: 'bottom',
      scale: 0.97,
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: TIMER_SELECTOR,
      delayMs: 0,
      distancePx: 20,
      durationMs: 820,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      intervalMs: 40,
      origin: 'bottom',
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: LEFT_SELECTOR,
      delayMs: revealConfig.delayMs,
      distancePx: 36,
      durationMs: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      origin: 'left',
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: RIGHT_SELECTOR,
      delayMs: revealConfig.delayMs,
      distancePx: 36,
      durationMs: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      origin: 'right',
      bottomOffsetPx: bottomTriggerOffsetPx,
    },
    {
      selector: HERO_SELECTOR,
      delayMs: heroDelayMs,
      distancePx: 28,
      durationMs: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      intervalMs: 60,
      origin: 'bottom',
      bottomOffsetPx: 0,
    },
  ]
}

const createRevealController = (): RevealController => {
  const tweens = new Set<gsap.core.Tween>()
  const initializedElements = new WeakSet<HTMLElement>()
  const trackedElements = new Set<HTMLElement>()

  const createRevealAnimations = () => {
    const pendingEntries = new Map<
      HTMLElement,
      {
        definition: RevealDefinition
        index: number
      }
    >()

    for (const definition of buildRevealDefinitions()) {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(definition.selector))

      elements.forEach((element, index) => {
        if (initializedElements.has(element)) {
          return
        }

        // Last matching selector wins, mirroring how overrides are declared.
        pendingEntries.set(element, {
          definition,
          index,
        })
      })
    }

    for (const [element, { definition, index }] of pendingEntries) {
      const axisStart = getAxisStart(definition.origin, definition.distancePx)
      const delayMs = definition.delayMs + (definition.intervalMs ?? 0) * index

      const fromVars: gsap.TweenVars = {
        opacity: 0,
        x: axisStart.x,
        y: axisStart.y,
        willChange: 'transform, opacity',
      }

      if (definition.scale !== undefined) {
        fromVars.scale = definition.scale
      }

      const toVars: gsap.TweenVars = {
        opacity: 1,
        x: 0,
        y: 0,
        duration: definition.durationMs / 1000,
        ease: definition.easing,
        delay: delayMs / 1000,
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(element, { clearProps: 'will-change' })
        },
        scrollTrigger: {
          trigger: element,
          start: () => `top ${getTriggerStartPx(element, definition.bottomOffsetPx)}px`,
          once: true,
          invalidateOnRefresh: true,
        },
      }

      if (definition.scale !== undefined) {
        toVars.scale = 1
      }

      element.setAttribute(GSAP_REVEAL_ATTRIBUTE, 'true')
      initializedElements.add(element)
      trackedElements.add(element)

      const tween = gsap.fromTo(element, fromVars, toVars)
      tweens.add(tween)
    }
  }

  const sync = () => {
    createRevealAnimations()
    ScrollTrigger.refresh()
  }

  const destroy = () => {
    for (const tween of tweens) {
      tween.kill()
    }
    tweens.clear()

    clearRevealInlineStyles(trackedElements)

    for (const element of trackedElements) {
      element.removeAttribute(GSAP_REVEAL_ATTRIBUTE)
    }
    trackedElements.clear()
  }

  return {
    destroy,
    sync,
  }
}

export const RevealProvider = () => {
  const pathname = usePathname()
  const revealControllerRef = useRef<RevealController | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    let failSafeTimeout: number | null = null
    let forceAllFailSafeTimeout: number | null = null
    let syncTimeout: number | null = null
    let syncAnimationFrame: number | null = null
    let deferredSyncTimeouts: number[] = []
    let mutationObserver: MutationObserver | null = null

    const scheduleSync = () => {
      if (syncTimeout !== null) {
        window.clearTimeout(syncTimeout)
      }

      syncTimeout = window.setTimeout(() => {
        syncTimeout = null

        if (syncAnimationFrame !== null) {
          window.cancelAnimationFrame(syncAnimationFrame)
        }

        syncAnimationFrame = window.requestAnimationFrame(() => {
          syncAnimationFrame = null
          revealControllerRef.current?.sync()
        })
      }, SYNC_DEBOUNCE_MS)
    }

    const scheduleDeferredSyncPasses = () => {
      deferredSyncTimeouts = DEFERRED_SYNC_DELAYS_MS.map((delayMs) =>
        window.setTimeout(() => {
          scheduleSync()
        }, delayMs),
      )
    }

    const setupMutationSync = () => {
      if (typeof MutationObserver !== 'function') {
        return
      }

      const siteContent = document.getElementById('site-content')
      if (!siteContent) {
        return
      }

      mutationObserver = new MutationObserver(() => {
        scheduleSync()
      })

      mutationObserver.observe(siteContent, {
        childList: true,
        subtree: true,
      })
    }

    const scheduleFailSafe = () => {
      if (failSafeTimeout !== null) {
        window.clearTimeout(failSafeTimeout)
      }

      failSafeTimeout = window.setTimeout(() => {
        const clearedInViewport = forceRevealFailSafe('viewport')
        if (clearedInViewport > 0) {
          if (forceAllFailSafeTimeout !== null) {
            window.clearTimeout(forceAllFailSafeTimeout)
          }

          forceAllFailSafeTimeout = window.setTimeout(() => {
            forceRevealFailSafe('all')
          }, FAILSAFE_FORCE_ALL_TIMEOUT_MS)
        }
      }, FAILSAFE_REVEAL_TIMEOUT_MS)
    }

    const initReveal = () => {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        forceRevealFailSafe('all')
        return
      }

      scheduleFailSafe()

      try {
        const controller = createRevealController()
        revealControllerRef.current = controller

        requestAnimationFrame(() => {
          controller.sync()
        })

        scheduleDeferredSyncPasses()
        setupMutationSync()
      } catch {
        forceRevealFailSafe('all')
      }
    }

    initReveal()

    return () => {
      if (failSafeTimeout !== null) {
        window.clearTimeout(failSafeTimeout)
      }
      if (forceAllFailSafeTimeout !== null) {
        window.clearTimeout(forceAllFailSafeTimeout)
      }
      if (syncTimeout !== null) {
        window.clearTimeout(syncTimeout)
      }
      if (syncAnimationFrame !== null) {
        window.cancelAnimationFrame(syncAnimationFrame)
      }
      for (const timeout of deferredSyncTimeouts) {
        window.clearTimeout(timeout)
      }

      mutationObserver?.disconnect()
      revealControllerRef.current?.destroy()
      revealControllerRef.current = null
    }
  }, [pathname])

  return null
}
