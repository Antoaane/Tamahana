import { Media } from '@/components/Media'
import type { LandingPageData } from '../types'

type Props = {
  data: LandingPageData['dropSection']
}

export const DropSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="bg-muted/40 px-6 py-16 md:px-12" id="preorder">
      <div className="mx-auto max-w-6xl space-y-8">
        {data?.countdownLabel && <h2 className="text-center text-2xl uppercase tracking-[0.2em]">{data.countdownLabel}</h2>}
        {data?.countdownTargetDate && (
          <p className="text-center text-sm text-muted-foreground">
            Date cible: {new Date(data.countdownTargetDate).toLocaleString('fr-FR')}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.pieces?.map((piece) => (
            <article className="overflow-hidden border border-border bg-card" key={piece.id}>
              {piece.image && typeof piece.image !== 'number' && (
                <Media className="aspect-[4/5] w-full" imgClassName="h-full w-full object-cover" resource={piece.image} />
              )}
              <div className="space-y-1 p-4">
                <h3 className="text-lg">{piece.name}</h3>
                {piece.collectionName && <p className="text-sm text-muted-foreground">{piece.collectionName}</p>}
                {piece.priceLabel && <p className="text-sm">{piece.priceLabel}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
