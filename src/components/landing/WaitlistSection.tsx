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

      <form>
        <div>
          <label htmlFor="waitlist-firstname">Prénom</label>
          <input id="waitlist-firstname" name="firstname" type="text" />
        </div>

        <div>
          <label htmlFor="waitlist-email">E-mail</label>
          <input id="waitlist-email" name="email" type="email" />
        </div>

        <button type="button">{buttonLabel || "Je m'inscris"}</button>
      </form>

      <p>{successMessage}</p>
    </section>
  )
}
