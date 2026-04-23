'use client'

import type { Media } from '@/payload-types'
import { useEffect, useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import NextImage from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type FeaturedProductItem = {
  id?: string | null
  image?: (number | null) | Media
  name?: string | null
  collection?: string | null
  price?: string | null
  link?: string | null
}

type FeaturedProductsSectionProps = {
  title?: string | null
  description?: string | null
  items?: FeaturedProductItem[] | null
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

const DEFAULT_COUNTDOWN: CountdownParts = {
  days: 5,
  hours: 16,
  minutes: 14,
  seconds: 27,
}

const FALLBACK_PRODUCTS: FeaturedProductItem[] = [
  {
    id: 'fallback-product-1',
    name: 'Nom de la pièce',
    collection: 'Collection',
    price: '45,95 €',
  },
  {
    id: 'fallback-product-2',
    name: 'Nom de la pièce',
    collection: 'Collection',
    price: '45,95 €',
  },
]

const PRODUCT_LIKED_STORAGE_KEY = 'tamahana:liked-products:v1'
const PRODUCT_LIKES_STORAGE_KEY = 'tamahana:product-like-counts:v1'

const TIMER_GRADIENT = {
  backgroundImage:
    'linear-gradient(180deg, var(--palette-3) 0%, var(--palette-3) 50%, rgb(from var(--palette-3) r g b / 0) 100%)',
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

const formatCountdownValue = (value: number) => value.toString().padStart(2, '0')

const readBooleanMap = (key: string): Record<string, boolean> => {
  try {
    const value = window.localStorage.getItem(key)
    if (!value) return {}

    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== 'object') return {}

    return Object.entries(parsed).reduce<Record<string, boolean>>((acc, [entryKey, entryValue]) => {
      acc[entryKey] = entryValue === true
      return acc
    }, {})
  } catch {
    return {}
  }
}

const readNumberMap = (key: string): Record<string, number> => {
  try {
    const value = window.localStorage.getItem(key)
    if (!value) return {}

    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== 'object') return {}

    return Object.entries(parsed).reduce<Record<string, number>>((acc, [entryKey, entryValue]) => {
      if (typeof entryValue === 'number' && Number.isFinite(entryValue)) {
        acc[entryKey] = Math.max(0, Math.floor(entryValue))
      }
      return acc
    }, {})
  } catch {
    return {}
  }
}

const writeStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // no-op
  }
}

const normalizeProducts = (products?: FeaturedProductItem[] | null) => {
  const items = (products || []).filter((item) => {
    return Boolean(item?.name || item?.collection || item?.price || item?.image || item?.link)
  })

  if (items.length >= 2) {
    return items.slice(0, 2)
  }

  return [...items, ...FALLBACK_PRODUCTS.slice(0, 2 - items.length)]
}

const getProductLikeKey = (product: FeaturedProductItem, index: number): string => {
  if (product.id && product.id.trim() !== '') {
    return `product:${product.id}`
  }

  return `product:fallback:${index}:${product.name ?? ''}:${product.collection ?? ''}`
}

const ProductLikeButton = ({ productLikeKey }: { productLikeKey: string }) => {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const likedProducts = readBooleanMap(PRODUCT_LIKED_STORAGE_KEY)
    const likeCounts = readNumberMap(PRODUCT_LIKES_STORAGE_KEY)

    setLiked(likedProducts[productLikeKey] === true)
    setLikes(likeCounts[productLikeKey] ?? 0)
  }, [productLikeKey])

  const handleLike = () => {
    if (liked) return

    const nextLikes = likes + 1
    const likedProducts = readBooleanMap(PRODUCT_LIKED_STORAGE_KEY)
    const likeCounts = readNumberMap(PRODUCT_LIKES_STORAGE_KEY)

    likedProducts[productLikeKey] = true
    likeCounts[productLikeKey] = nextLikes

    writeStorage(PRODUCT_LIKED_STORAGE_KEY, likedProducts)
    writeStorage(PRODUCT_LIKES_STORAGE_KEY, likeCounts)

    setLiked(true)
    setLikes(nextLikes)
  }

  return (
    <button
      aria-label={liked ? 'Produit liké' : 'Liker ce produit'}
      className="inline-flex items-center gap-2 text-palette-3/90 disabled:cursor-default"
      disabled={liked}
      onClick={handleLike}
      type="button"
    >
      <span className="font-cloud-lucent text-sm leading-none tabular-nums">{likes}</span>
      <Heart
        aria-hidden
        className={`mb-1 size-7 stroke-[1.6] md:size-8 ${liked ? 'fill-current' : ''}`}
      />
    </button>
  )
}

const WaitlistProductCard = ({
  product,
  productLikeKey,
}: {
  product: FeaturedProductItem
  productLikeKey: string
}) => {
  const image = resolveMediaSource(product.image)

  return (
    <article className="border-2 border-palette-4 bg-palette-2 text-palette-3">
      <div className="relative aspect-square w-full overflow-hidden bg-palette-1/80">
        {image ? (
          <NextImage
            alt={image.alt || product.name || 'Produit'}
            className="object-cover"
            fill
            sizes="(min-width: 768px) 23rem, 100vw"
            src={image.src}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(122,106,75,0.23),transparent_56%),linear-gradient(165deg,rgba(255,246,229,0.35),rgba(195,178,130,0.4))]" />
        )}
      </div>

      <div className="flex min-h-44 flex-col px-5 py-4 md:px-6 md:py-5">
        <h3 className="whitespace-pre-line font-baskervville text-2xl">
          {product.name || 'Nom de la pièce'}
        </h3>
        <p className="mt-1 whitespace-pre-line font-baskervville text-lg leading-none text-palette-3/95">
          {product.collection || 'Collection'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-7">
          <p className="whitespace-pre-line font-cloud-lucent text-base leading-none">
            {product.price || '45,95 €'}
          </p>

          <ProductLikeButton productLikeKey={productLikeKey} />
        </div>
      </div>
    </article>
  )
}

export const FeaturedProductsSection = ({
  title,
  description,
  items,
  launchDate,
  launchTime,
  launchTimezone,
}: FeaturedProductsSectionProps) => {
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

  // Keep SSR/CSR initial render deterministic to avoid hydration mismatches.
  const [countdown, setCountdown] = useState<CountdownParts | null>(null)

  useEffect(() => {
    if (!targetTime) {
      setCountdown(DEFAULT_COUNTDOWN)
      return
    }

    const tick = () => setCountdown(getCountdown(targetTime))
    tick()

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [targetTime])

  const safeCountdown = countdown ?? DEFAULT_COUNTDOWN

  const timerItems = [
    { label: 'Jours', value: safeCountdown.days },
    { label: 'Heures', value: safeCountdown.hours },
    { label: 'Minutes', value: safeCountdown.minutes },
    { label: 'Secondes', value: safeCountdown.seconds },
  ]

  const productsToDisplay = useMemo(() => normalizeProducts(items), [items])

  return (
    <section
      id="featured-products-section"
      className="relative isolate overflow-hidden border-y border-palette-4/25 bg-palette-1 py-16 md:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/svgs/polynesian-patterns.svg')] bg-repeat opacity-[0.02] [background-size:clamp(52rem,95vw,132rem)_auto]"
      />

      <div className="relative container">
        {title ? <h2 className="sr-only whitespace-pre-line">{title}</h2> : null}
        {description ? <p className="sr-only whitespace-pre-line">{description}</p> : null}

        <div className="mx-auto w-full max-w-[76rem]">
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 text-center sm:grid-cols-4 sm:gap-x-7">
            {timerItems.map((item, index) => {
              return (
                <div key={item.label} className="relative">
                  <p
                    className="font-baskervville text-[clamp(3.75rem,10vw,12rem)] leading-[0.85] tabular-nums tracking-[0.01em]"
                    data-sr-timer="true"
                  >
                    <span
                      className="inline-block bg-clip-text text-transparent"
                      style={TIMER_GRADIENT}
                    >
                      {formatCountdownValue(item.value)}
                    </span>

                    {index < timerItems.length - 1 ? (
                      <span className="pointer-events-none absolute -right-[0.15em] top-[0.05em] hidden text-palette-3/55 sm:block">
                        :
                      </span>
                    ) : null}
                  </p>

                  <p className="mt-4 font-baskervville text-2xl leading-none text-palette-3">
                    {item.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-[49rem] gap-5 md:mt-24 md:grid-cols-2 md:gap-6">
          {productsToDisplay.map((product, index) => {
            const productLikeKey = getProductLikeKey(product, index)

            return (
              <WaitlistProductCard
                key={productLikeKey}
                product={product}
                productLikeKey={productLikeKey}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
