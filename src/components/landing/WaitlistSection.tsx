type WaitlistSectionProps = {
  title?: string | null
  description?: string | null
  buttonLabel?: string | null
  successMessage?: string | null
}

export const WaitlistSection = ({
  title,
  description,
  buttonLabel,
  successMessage,
}: WaitlistSectionProps) => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>

      <form
        action="https://assets.mailerlite.com/jsonp/2283434/forms/185369647657256075/subscribe"
        method="post"
        target="_blank"
      >
        <div>
          <input
            aria-label="name"
            aria-required="true"
            type="text"
            name="fields[name]"
            placeholder="Ton prénom"
            autoComplete="given-name"
            required
          />
        </div>

        <div>
          <input
            aria-label="email"
            aria-required="true"
            type="email"
            name="fields[email]"
            placeholder="Ton e-mail"
            autoComplete="email"
            required
          />
        </div>

        <input type="hidden" name="ml-submit" value="1" />
        <input type="hidden" name="anticsrf" value="true" />

        <button type="submit">{buttonLabel || "Je m'inscris"}</button>
      </form>

      <p>{successMessage}</p>
    </section>
  )
}
