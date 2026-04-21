import { DesignsSection } from './DesignsSection'
import { FeaturedProductsSection, type FeaturedProductItem } from './FeaturedProductsSection'
import { HeroSection } from './HeroSection'
import { MaterialsSection } from './MaterialsSection'
import { StorySection } from './StorySection'
import { WaitlistSection } from './WaitlistSection'

type LandingContent = {
  hero?: {
    title?: string | null
    subtitle?: string | null
  } | null
  featuredProducts?: {
    items?: FeaturedProductItem[] | null
  } | null
  waitlist?: {
    title?: string | null
    description?: string | null
    buttonLabel?: string | null
    successMessage?: string | null
  } | null
  story?: {
    title?: string | null
    introduction?: string | null
  } | null
  materials?: {
    title?: string | null
    content?: string | null
  } | null
  designs?: {
    title?: string | null
    content?: string | null
  } | null
} | null

export type LandingPageData = {
  title?: string | null
  landingContent?: LandingContent
}

type LandingPageProps = {
  page: LandingPageData
}

export const LandingPage = ({ page }: LandingPageProps) => {
  const landingContent = page.landingContent

  return (
    <div>
      <HeroSection
        title={landingContent?.hero?.title ?? page.title}
        subtitle={landingContent?.hero?.subtitle}
      />

      <FeaturedProductsSection items={landingContent?.featuredProducts?.items ?? []} />

      <WaitlistSection
        title={landingContent?.waitlist?.title}
        description={landingContent?.waitlist?.description}
        buttonLabel={landingContent?.waitlist?.buttonLabel}
        successMessage={landingContent?.waitlist?.successMessage}
      />

      <StorySection
        title={landingContent?.story?.title}
        introduction={landingContent?.story?.introduction}
      />

      <MaterialsSection
        title={landingContent?.materials?.title}
        content={landingContent?.materials?.content}
      />

      <DesignsSection
        title={landingContent?.designs?.title}
        content={landingContent?.designs?.content}
      />
    </div>
  )
}
