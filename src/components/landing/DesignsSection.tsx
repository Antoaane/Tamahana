import NextImage from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export interface DesignsSectionProps {
  title?: string | null
  content?: string | null
  image?: (number | null) | Media
}

const FALLBACK_DESIGNS_IMAGE_SOURCE = '/media/image-post1.webp'

const resolveMediaSource = (media?: (number | null) | Media) => {
  if (!media || typeof media !== 'object') return null
  if (!media.url) return null

  return {
    src: getMediaUrl(media.url, media.updatedAt),
    alt: media.alt || '',
  }
}

export function DesignsSection({ title, content, image }: DesignsSectionProps) {
  if (!title && !content && !image) {
    return null
  }

  const resolvedImage = resolveMediaSource(image) || {
    src: FALLBACK_DESIGNS_IMAGE_SOURCE,
    alt: 'Designs Tamahana',
  }

  return (
    <section className="relative isolate overflow-hidden bg-palette-1 py-8 font-cloud-lucent md:py-10 lg:py-20">
      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16">
          <div className="mx-auto w-full max-w-[30rem] lg:mx-0">
            <div className="image-mask-2 relative aspect-[582/792] overflow-hidden bg-palette-4/20">
              <NextImage
                alt={resolvedImage.alt || title || 'Designs Tamahana'}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 30rem, (min-width: 768px) 26rem, 100vw"
                src={resolvedImage.src}
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[40rem] text-palette-text lg:mx-0 lg:justify-self-end">
            <NextImage
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 hidden w-[85%] h-auto select-none lg:block"
              height={578}
              src="/svgs/hibiscus-3.svg"
              width={621}
            />

            <div className="relative z-10">
              {title ? (
                <h2 className="whitespace-pre-line font-cinzel font-bold text-3xl uppercase tracking-[0.03em] text-palette-text">
                  {title}
                </h2>
              ) : null}

              {content ? (
                <p
                  className={[
                    title ? 'mt-6' : '',
                    'whitespace-pre-line text-base leading-relaxed md:text-base',
                  ].join(' ')}
                >
                  {content}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
