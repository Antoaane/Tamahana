import { Media } from '@/components/Media'
import type { LandingPageData } from '../types'

type Props = {
  data: LandingPageData['heroSection']
}

export const HeroSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="relative min-h-[70vh] border-b border-border" id="top">
      {data?.backgroundImage && typeof data.backgroundImage !== 'number' && (
        <Media className="absolute inset-0 h-full w-full" fill imgClassName="object-cover" resource={data.backgroundImage} />
      )}

      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-between gap-10 px-6 py-8 text-white md:px-12">
        <nav className="flex items-center justify-end gap-6 text-sm">
          {data?.navigationLinks?.map((link) => (
            <a className="underline-offset-4 hover:underline" href={`#${link.targetId}`} key={link.id ?? link.targetId}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6 pb-4 text-center">
          {data?.brandMark && typeof data.brandMark !== 'number' && (
            <Media className="mx-auto w-12" resource={data.brandMark} size="48px" />
          )}
          <h1 className="text-5xl tracking-[0.2em] md:text-7xl">{data?.brandName}</h1>
          {data?.tagline && <p className="text-xl italic">{data.tagline}</p>}
        </div>
      </div>
    </section>
  )
}
