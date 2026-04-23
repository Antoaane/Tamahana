'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import NextImage from 'next/image'

type HeroSectionProps = {
  backgroundImageDesktop?: (number | null) | Media
  backgroundImageMobile?: (number | null) | Media
  title?: string | null
  subtitle?: string | null
  launchDate?: string | null
  launchTime?: string | null
  launchTimezone?: string | null
}

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const resolveMediaSource = (media?: (number | null) | Media) => {
  if (!media || typeof media !== 'object') return null
  if (!media.url) return null

  return {
    src: getMediaUrl(media.url, media.updatedAt),
    alt: media.alt || '',
  }
}

const parseDateParts = (dateValue?: string | null) => {
  if (!dateValue) return null
  const yyyyMmDd = dateValue.slice(0, 10)
  const [yearRaw, monthRaw, dayRaw] = yyyyMmDd.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }

  return { year, month, day }
}

const parseTimeParts = (timeValue?: string | null) => {
  const normalized = (timeValue || '00:00').trim()
  const [hourRaw, minuteRaw] = normalized.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { hour: 0, minute: 0 }
  }

  return { hour, minute }
}

const zonedDateTimeToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string,
) => {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(utcGuess)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  const asIfUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  )

  const offsetMs = asIfUtc - utcGuess.getTime()
  return new Date(utcGuess.getTime() - offsetMs)
}

const getCountdown = (targetMs: number): CountdownParts => {
  const remainingMs = Math.max(0, targetMs - Date.now())
  const totalSeconds = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

export const HeroSection = ({
  backgroundImageDesktop,
  backgroundImageMobile,
  title,
  subtitle,
  launchDate,
  launchTime,
  launchTimezone,
}: HeroSectionProps) => {
  const desktopBackground = useMemo(
    () => resolveMediaSource(backgroundImageDesktop),
    [backgroundImageDesktop],
  )
  const mobileBackground = useMemo(
    () => resolveMediaSource(backgroundImageMobile),
    [backgroundImageMobile],
  )
  const fallbackBackground = desktopBackground || mobileBackground

  const targetTime = useMemo(() => {
    const date = parseDateParts(launchDate)
    if (!date) return null

    const time = parseTimeParts(launchTime)
    const timezone = launchTimezone || 'Europe/Paris'

    return zonedDateTimeToUtc(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
      timezone,
    ).getTime()
  }, [launchDate, launchTime, launchTimezone])

  const [countdown, setCountdown] = useState<CountdownParts | null>(
    targetTime ? getCountdown(targetTime) : null,
  )

  useEffect(() => {
    if (!targetTime) {
      setCountdown(null)
      return
    }

    const tick = () => setCountdown(getCountdown(targetTime))
    tick()

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [targetTime])

  if (!title && !subtitle && !countdown && !fallbackBackground) {
    return null
  }

  const isFinished =
    countdown !== null &&
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes === 0 &&
    countdown.seconds === 0

  return (
    <section className="relative isolate flex h-dvh items-center overflow-hidden px-5 pb-24 pt-20 md:px-10 md:pb-28 md:pt-28 lg:px-16 lg:pt-32">
      {mobileBackground ? (
        <NextImage
          alt={mobileBackground.alt}
          className="object-cover md:hidden"
          data-sr-ignore="true"
          fill
          priority
          sizes="100vw"
          src={mobileBackground.src}
        />
      ) : null}

      {desktopBackground ? (
        <NextImage
          alt={desktopBackground.alt}
          className="hidden object-cover md:block"
          data-sr-ignore="true"
          fill
          priority
          sizes="100vw"
          src={desktopBackground.src}
        />
      ) : null}

      {!fallbackBackground ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,120,150,0.48),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(103,124,195,0.42),transparent_38%),linear-gradient(180deg,#9e6f7a_0%,#8b6a73_35%,#6e575f_100%)]" />
      ) : null}

      <div aria-hidden className="hero-background-dim-overlay" />
      <div aria-hidden className="hero-grain-overlay" />

      <div className="relative z-10 mx-auto flex w-full max-w-275 h-full flex-col items-center justify-between text-center">
        {title ? (
          <h1 className="relative mb-6 font-cinzel text-[clamp(2.35rem,12vw,3.5rem)] leading-[0.9] tracking-[0.025em] text-palette-1 sm:text-[clamp(3.9rem,15.5vw,10rem)] sm:leading-[0.87] sm:tracking-[0.05em]">
            <span className="block whitespace-pre-line uppercase relative z-1 translate-y-[calc(clamp(2.35rem,12vw,3.5rem)*0.36)] sm:translate-y-[calc(clamp(3.9rem,15.5vw,10rem)*0.4)]">
              {title}
            </span>
            <span className="block whitespace-pre-line uppercase relative z-0 bg-[linear-gradient(180deg,var(--palette-6),var(--palette-7))] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        ) : null}

        <div className="flex flex-col items-center gap-6">
          {subtitle ? (
            <p className="whitespace-pre-line font-baskervville text-[clamp(2.1rem,3.9vw,3.4rem)] italic leading-tight text-palette-1/95">
              {subtitle}
            </p>
          ) : null}

          {countdown ? (
            <div className="mt-5 rounded-full bg-black/25 px-5 py-2 backdrop-blur-sm">
              {isFinished ? (
                <p className="font-cinzel text-sm uppercase tracking-[0.28em] text-palette-1/90">
                  Lancement en cours
                </p>
              ) : (
                <p className="font-cinzel text-sm uppercase tracking-[0.28em] text-palette-1/90">
                  {countdown.days}j {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-20 h-3 bg-palette-2/75"
        style={{
          WebkitMaskImage: 'url(/svgs/polynesian-shark-teeth.svg)',
          maskImage: 'url(/svgs/polynesian-shark-teeth.svg)',
          WebkitMaskPosition: 'center bottom',
          maskPosition: 'center bottom',
          WebkitMaskRepeat: 'repeat-x',
          maskRepeat: 'repeat-x',
          WebkitMaskSize: 'auto 100%',
          maskSize: 'auto 100%',
        }}
      />
    </section>
  )
}
