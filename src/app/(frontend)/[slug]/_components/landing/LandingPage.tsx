import type { Page } from '@/payload-types'
import { DropSection } from './sections/DropSection'
import { HeroSection } from './sections/HeroSection'
import { NewsletterSection } from './sections/NewsletterSection'
import { StorySection } from './sections/StorySection'

type Props = {
  landingPage: Page['landingPage']
}

export const LandingPage: React.FC<Props> = ({ landingPage }) => {
  if (!landingPage) return null

  return (
    <>
      <HeroSection data={landingPage.heroSection} />
      <DropSection data={landingPage.dropSection} />
      <NewsletterSection data={landingPage.newsletterSection} />
      <StorySection data={landingPage.storySection} />
    </>
  )
}
