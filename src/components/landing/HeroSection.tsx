type HeroSectionProps = {
  title?: string | null
  subtitle?: string | null
}

export const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  if (!title && !subtitle) {
    return null
  }

  return (
    <section>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  )
}
