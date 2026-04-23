'use client'

import { useEffect, useMemo, useState } from 'react'

type HeroSectionProps = {
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
  title,
  subtitle,
  launchDate,
  launchTime,
  launchTimezone,
}: HeroSectionProps) => {
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

  if (!title && !subtitle && !countdown) {
    return null
  }

  const isFinished =
    countdown !== null &&
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes === 0 &&
    countdown.seconds === 0

  return (
    <section>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {countdown ? (
          <div>
            {isFinished ? (
              <p>Lancement en cours</p>
            ) : (
              <p>
                {countdown.days}j {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
