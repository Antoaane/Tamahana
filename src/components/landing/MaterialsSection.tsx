import NextImage from 'next/image'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { isLexicalContent, type TextContent } from './richText'

export interface MaterialsSectionProps {
  title?: string | null
  content?: TextContent
  image?: (number | null) | Media
}

const FALLBACK_MATERIALS_IMAGE_SOURCE = '/media/product-exemple.jpg'

const resolveMediaSource = (media?: (number | null) | Media) => {
  if (!media || typeof media !== 'object') return null
  if (!media.url) return null

  return {
    src: getMediaUrl(media.url, media.updatedAt),
    alt: media.alt || '',
  }
}

export function MaterialsSection({ title, content, image }: MaterialsSectionProps) {
  if (!title && !content && !image) {
    return null
  }

  const resolvedImage = resolveMediaSource(image) || {
    src: FALLBACK_MATERIALS_IMAGE_SOURCE,
    alt: 'Matières Tamahana',
  }

  return (
    <section
      id="materials-section"
      className="relative isolate overflow-hidden bg-palette-1 py-8 font-cloud-lucent md:py-10 lg:py-20"
    >
      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[40rem] text-palette-text lg:mx-0 row-start-2 lg:row-start-1">
            <NextImage
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 hidden w-[85%] h-auto select-none lg:block"
              height={578}
              src="/svgs/hibiscus-4.svg"
              width={621}
            />

            <div className="relative z-10">
              {title ? (
                <h2 className="whitespace-pre-line font-cinzel font-bold text-3xl uppercase tracking-[0.03em] text-palette-text">
                  {title}
                </h2>
              ) : null}

              {content ? (
                isLexicalContent(content) ? (
                  <RichText
                    className={[
                      title ? 'mt-6' : '',
                      'text-base leading-relaxed md:text-base [&_p]:m-0 [&_p+*]:mt-4',
                    ].join(' ')}
                    data={content}
                    enableGutter={false}
                    enableProse={false}
                  />
                ) : (
                  <p
                    className={[
                      title ? 'mt-6' : '',
                      'whitespace-pre-line text-base leading-relaxed md:text-base',
                    ].join(' ')}
                  >
                    {content}
                  </p>
                )
              ) : null}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[32rem] lg:mx-0 lg:justify-self-end">
            <div className="image-mask-1 relative aspect-square overflow-hidden bg-palette-4/20">
              <NextImage
                alt={resolvedImage.alt || title || 'Matières Tamahana'}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 32rem, (min-width: 768px) 28rem, 100vw"
                src={resolvedImage.src}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
