import { Media } from '@/components/Media'
import type { LandingPageData } from '../types'

type Props = {
  data: LandingPageData['newsletterSection']
}

export const NewsletterSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="bg-secondary px-6 py-16 md:px-12" id="contact">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <div>
          {data?.sideImage && typeof data.sideImage !== 'number' && (
            <Media className="aspect-[3/4] w-full" imgClassName="h-full w-full object-cover" resource={data.sideImage} />
          )}
        </div>

        <div className="space-y-4 self-center">
          {data?.icon && typeof data.icon !== 'number' && (
            <Media className="w-10" resource={data.icon} size="40px" />
          )}
          {data?.headline && <h2 className="text-3xl uppercase">{data.headline}</h2>}
          {data?.description && <p className="text-sm text-muted-foreground">{data.description}</p>}

          <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
            <input
              aria-label="Prénom"
              className="h-11 border border-input bg-background px-3"
              placeholder={data?.firstNamePlaceholder ?? 'Ton prénom'}
              type="text"
            />
            <input
              aria-label="Email"
              className="h-11 border border-input bg-background px-3"
              placeholder={data?.emailPlaceholder ?? 'Ton email'}
              type="email"
            />
            <button className="h-11 bg-primary text-primary-foreground" type="submit">
              {data?.submitLabel ?? "Je m'inscris"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
