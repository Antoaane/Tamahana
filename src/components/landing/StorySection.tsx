import NextImage from 'next/image'
import RichText from '@/components/RichText'
import { isLexicalContent, type TextContent } from './richText'

type StorySectionProps = {
  title?: string | null
  introduction?: TextContent
}

export const StorySection = ({ title, introduction }: StorySectionProps) => {
  if (!title && !introduction) {
    return null
  }

  return (
    <section
      id="story-section"
      className="relative isolate overflow-hidden bg-palette-1 py-8 font-cloud-lucent md:py-10 lg:py-20"
    >
      <NextImage
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-32 -translate-y-1/2 hidden h-[50%] xl:h-[70%] w-auto select-none lg:block xl:-left-24"
        height={329}
        src="/svgs/hibiscus-1.svg"
        width={241}
      />
      <NextImage
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-32 -translate-y-1/2 hidden h-[50%] xl:h-[70%] w-auto select-none lg:block xl:-right-24"
        height={315}
        src="/svgs/hibiscus-2.svg"
        width={242}
      />

      <div className="container relative">
        <div className="relative z-10 mx-auto w-full max-w-[50rem] text-center text-palette-text">
          {title ? (
            <h2 className="whitespace-pre-line font-cinzel font-bold text-3xl uppercase tracking-[0.03em] text-palette-text">
              {title}
            </h2>
          ) : null}

          {introduction ? (
            isLexicalContent(introduction) ? (
              <RichText
                className={[
                  title ? 'mt-6' : '',
                  'text-base leading-relaxed md:text-base [&_p]:m-0 [&_p+*]:mt-4',
                ].join(' ')}
                data={introduction}
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
                {introduction}
              </p>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
}
