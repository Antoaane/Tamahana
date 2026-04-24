'use client'

import type { CSSProperties, FormEvent } from 'react'
import { useId, useMemo, useRef, useState } from 'react'
import NextImage from 'next/image'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { isLexicalContent, type TextContent } from './richText'

type MediaRelation = (number | null) | Media

type WaitlistSectionProps = {
  video?: MediaRelation
  title?: string | null
  description?: TextContent
  buttonLabel?: string | null
  successMessage?: TextContent
}

const DEFAULT_TITLE = 'LE 1ER MAI, UNE NOUVELLE AVENTURE COMMENCE'
const DEFAULT_DESCRIPTION = "Drop le 1er mai - Inscris toi sur la liste d'attente"
const DEFAULT_BUTTON_LABEL = "Je m'inscris"
const FALLBACK_VIDEO_SOURCE = '/media/iw-mehani-compressed-720p.mp4'

const VIDEO_MASK_STYLE = {
  WebkitMaskImage:
    'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
} satisfies CSSProperties

const resolveVideoSource = (video?: MediaRelation) => {
  if (!video || typeof video !== 'object' || !video.url) {
    return {
      src: FALLBACK_VIDEO_SOURCE,
      type: 'video/mp4',
    }
  }

  if (video.mimeType && !video.mimeType.includes('video')) {
    return {
      src: FALLBACK_VIDEO_SOURCE,
      type: 'video/mp4',
    }
  }

  return {
    src: getMediaUrl(video.url, video.updatedAt),
    type: video.mimeType || 'video/mp4',
  }
}

export const WaitlistSection = ({
  video,
  title,
  description,
  buttonLabel,
  successMessage,
}: WaitlistSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [didSubmit, setDidSubmit] = useState(false)
  const didAttemptSubmitRef = useRef(false)
  const frameId = useId()
  const submitFrameTarget = useMemo(
    () => `waitlist-submit-${frameId.replaceAll(':', '')}`,
    [frameId],
  )

  const resolvedTitle = title || DEFAULT_TITLE
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION
  const resolvedButtonLabel = buttonLabel || DEFAULT_BUTTON_LABEL
  const resolvedSuccessMessage = successMessage ?? null
  const resolvedVideoSource = resolveVideoSource(video)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!event.currentTarget.checkValidity()) {
      return
    }

    didAttemptSubmitRef.current = true
    setDidSubmit(false)
    setIsSubmitting(true)
  }

  const handleSubmitFrameLoad = () => {
    if (!didAttemptSubmitRef.current) {
      return
    }

    didAttemptSubmitRef.current = false
    setIsSubmitting(false)
    setDidSubmit(true)
  }

  return (
    <section
      id="waitlist-section"
      className="relative isolate overflow-hidden bg-palette-8 py-16 md:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/svgs/polynesian-patterns.svg')] bg-repeat opacity-[0.02] [background-size:clamp(52rem,95vw,132rem)_auto]"
      />

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,31rem)_minmax(0,1fr)] lg:gap-16">
          <div className="mx-auto w-full max-w-[31rem]">
            <div
              className="relative aspect-[9/16] overflow-hidden shadow-[0_8px_36px_rgba(122,106,75,0.22)]"
              style={VIDEO_MASK_STYLE}
            >
              <video
                aria-hidden
                autoPlay
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="none"
              >
                <source src={resolvedVideoSource.src} type={resolvedVideoSource.type} />
              </video>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[35rem] flex-col items-center text-center">
            <NextImage
              alt=""
              aria-hidden
              className="sm:size-24 md:size-36 lg:size-48"
              height={68}
              src="/svgs/turtle.svg"
              width={68}
            />

            <h2 className="mt-5 w-full whitespace-pre-line font-cinzel text-[clamp(1.5rem,1.65vw,1.925rem)] leading-[1.25] tracking-[0.03em] text-palette-text uppercase">
              {resolvedTitle}
            </h2>

            {resolvedDescription ? (
              isLexicalContent(resolvedDescription) ? (
                <RichText
                  className="mt-8 font-cloud-lucent text-lg leading-tight text-palette-text [&_p]:m-0 [&_p+*]:mt-3"
                  data={resolvedDescription}
                  enableGutter={false}
                  enableProse={false}
                />
              ) : (
                <p className="mt-8 whitespace-pre-line font-cloud-lucent text-lg leading-tight text-palette-text">
                  {resolvedDescription}
                </p>
              )
            ) : null}

            <form
              action="https://assets.mailerlite.com/jsonp/2283434/forms/185369647657256075/subscribe"
              aria-busy={isSubmitting}
              className="mt-8 w-full space-y-3 text-left font-cloud-lucent"
              method="post"
              onSubmit={handleSubmit}
              target={submitFrameTarget}
            >
              <div>
                <label className="sr-only" htmlFor="waitlist-name">
                  Ton prenom
                </label>
                <input
                  aria-required="true"
                  autoComplete="given-name"
                  className="w-full border border-palette-3/45 bg-palette-1 px-7 py-4 text-base leading-none text-palette-text placeholder:text-palette-text/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/40"
                  id="waitlist-name"
                  name="fields[name]"
                  placeholder="Ton prenom"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="waitlist-email">
                  Ton e-mail
                </label>
                <input
                  aria-required="true"
                  autoComplete="email"
                  className="w-full border border-palette-3/45 bg-palette-1 px-7 py-4 text-base leading-none text-palette-text placeholder:text-palette-text/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/40"
                  id="waitlist-email"
                  name="fields[email]"
                  placeholder="Ton e-mail"
                  required
                  type="email"
                />
              </div>

              <input name="ml-submit" type="hidden" value="1" />
              <input name="anticsrf" type="hidden" value="true" />

              <button
                className="w-full whitespace-pre-line bg-palette-text px-7 py-4 text-center font-cloud-lucent text-xl leading-none text-palette-1 transition-colors hover:bg-palette-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/45 disabled:cursor-not-allowed disabled:opacity-80 cursor-pointer"
                disabled={isSubmitting}
                type="submit"
              >
                {resolvedButtonLabel}
              </button>
            </form>

            <iframe
              className="hidden"
              name={submitFrameTarget}
              onLoad={handleSubmitFrameLoad}
              title="Soumission liste d'attente"
            />

            {didSubmit && resolvedSuccessMessage ? (
              isLexicalContent(resolvedSuccessMessage) ? (
                <RichText
                  aria-live="polite"
                  className="mt-4 font-cloud-lucent text-base text-palette-3/85 [&_p]:m-0 [&_p+*]:mt-2"
                  data={resolvedSuccessMessage}
                  enableGutter={false}
                  enableProse={false}
                />
              ) : (
                <p
                  aria-live="polite"
                  className="mt-4 whitespace-pre-line font-cloud-lucent text-base text-palette-3/85"
                >
                  {resolvedSuccessMessage}
                </p>
              )
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 z-20 h-3 bg-palette-3/75"
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
