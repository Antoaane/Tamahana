export type FeaturedProductItem = {
  name?: string | null
  price?: string | null
}

type FeaturedProductsSectionProps = {
  items: FeaturedProductItem[]
}

export const FeaturedProductsSection = ({ items }: FeaturedProductsSectionProps) => {
  if (!items.length) {
    return null
  }

  return (
    <section>
      <h2>Produits mis en avant</h2>
      <div>
        {items.map((item, index) => {
          return (
            <div key={`${item.name ?? 'produit'}-${index}`}>
              <p>{item.name}</p>
              <p>{item.price}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
