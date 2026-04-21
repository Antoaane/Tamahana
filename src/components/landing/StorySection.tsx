type StorySectionProps = {
  title?: string | null
  introduction?: string | null
}

export const StorySection = ({ title, introduction }: StorySectionProps) => {
  if (!title && !introduction) {
    return null
  }

  return (
    <section>
      <h2>{title}</h2>
      <p>{introduction}</p>
    </section>
  )
}
