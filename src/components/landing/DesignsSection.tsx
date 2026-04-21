type DesignsSectionProps = {
  title?: string | null
  content?: string | null
}

export const DesignsSection = ({ title, content }: DesignsSectionProps) => {
  if (!title && !content) {
    return null
  }

  return (
    <section>
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  )
}
