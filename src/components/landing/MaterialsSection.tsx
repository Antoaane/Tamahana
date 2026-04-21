type MaterialsSectionProps = {
  title?: string | null
  content?: string | null
}

export const MaterialsSection = ({ title, content }: MaterialsSectionProps) => {
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
