import type { LucideIcon, LucideProps } from 'lucide-react'
import { Facebook, Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

export type SocialIcon = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube' | 'linkedin' | 'website'

export type SocialLinkItem = {
  name?: string | null
  link?: string | null
  icon?: SocialIcon | null
}

export type SocialLinksSectionProps = {
  title?: string | null
  items?: SocialLinkItem[] | null
}

const DEFAULT_TITLE = 'Suivez-nous'

const TikTokIcon = ((props: LucideProps) => (
  <svg
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M14 3v10.2a3.8 3.8 0 1 1-3.2-3.74" />
    <path d="M14 7.8a5.8 5.8 0 0 0 4 1.6" />
  </svg>
)) as LucideIcon

const ICONS: Record<SocialIcon, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  tiktok: TikTokIcon,
  youtube: Youtube,
  linkedin: Linkedin,
  website: Globe,
}

const DEFAULT_LABELS: Record<SocialIcon, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  website: 'Site web',
}

const trim = (value?: string | null) => value?.trim() || ''

const normalizeHref = (href: string) => {
  if (!href) return ''
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href) || href.startsWith('/') || href.startsWith('#')) {
    return href
  }

  return `https://${href}`
}

const opensInNewTab = (href: string) => /^(https?:)?\/\//i.test(href)

type NormalizedSocialLink = {
  icon: SocialIcon
  label: string
  href: string
}

const normalizeItems = (items?: SocialLinkItem[] | null) => {
  return (items || [])
    .map<NormalizedSocialLink | null>((item) => {
      const rawHref = trim(item?.link)
      const href = normalizeHref(rawHref)
      if (!href) return null

      const icon = item?.icon || 'website'
      const label = trim(item?.name) || DEFAULT_LABELS[icon]

      return {
        icon,
        label,
        href,
      }
    })
    .filter((item): item is NormalizedSocialLink => item !== null)
}

export const SocialLinksSection = ({ title, items }: SocialLinksSectionProps) => {
  const links = normalizeItems(items)

  if (!links.length) {
    return null
  }

  return (
    <section
      id="social-links-section"
      className="relative isolate overflow-hidden border-t border-palette-4/30 bg-palette-8 py-10 md:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.03] [background-size:clamp(44rem,90vw,120rem)_auto]"
      />

      <div className="container relative">
        <h2 className="text-center font-cinzel text-2xl tracking-[0.03em] text-palette-text uppercase md:text-3xl">
          {title || DEFAULT_TITLE}
        </h2>

        <ul className="mt-8 flex gap-6 justify-center flex-wrap">
          {links.map((item, index) => {
            const Icon = ICONS[item.icon]
            const shouldOpenInNewTab = opensInNewTab(item.href)

            return (
              <li key={`${item.icon}-${item.href}-${index}`}>
                <a
                  className="group flex min-h-14 w-56 items-center justify-center gap-2.5 border border-palette-4/55 bg-palette-1 px-4 py-3 font-cloud-lucent text-lg text-palette-text transition-colors hover:bg-palette-3 hover:text-palette-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/45"
                  href={item.href}
                  rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                  target={shouldOpenInNewTab ? '_blank' : undefined}
                >
                  <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
