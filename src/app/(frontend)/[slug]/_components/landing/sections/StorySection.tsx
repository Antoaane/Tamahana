import { Media } from '@/components/Media'
import type { LandingPageData } from '../types'

type Props = {
  data: LandingPageData['storySection']
}

export const StorySection: React.FC<Props> = ({ data }) => {
  return (
    <section className="bg-background px-6 py-16 md:px-12" id="histoire">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          {data?.heading && <h2 className="text-3xl uppercase">{data.heading}</h2>}
          {data?.introParagraphs?.map((paragraph) => (
            <p className="text-sm text-muted-foreground" key={paragraph.id}>
              {paragraph.text}
            </p>
          ))}
        </header>

        <div className="space-y-12">
          {data?.featureRows?.map((row, index) => {
            const reverse = index % 2 === 1

            return (
              <article className="grid items-start gap-8 md:grid-cols-2" key={row.id}>
                <div className={reverse ? 'md:order-2' : undefined}>
                  {row.image && typeof row.image !== 'number' && (
                    <Media className="aspect-[4/5] w-full" imgClassName="h-full w-full object-cover" resource={row.image} />
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl uppercase">{row.title}</h3>
                  {row.paragraphs?.map((paragraph) => (
                    <p className="text-sm text-muted-foreground" key={paragraph.id}>
                      {paragraph.text}
                    </p>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
