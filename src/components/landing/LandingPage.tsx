import { DesignsSection, type DesignsSectionProps } from './DesignsSection'
import { FeaturedProductsSection, type FeaturedProductItem } from './FeaturedProductsSection'
import { HeroSection } from './HeroSection'
import { MaterialsSection, type MaterialsSectionProps } from './MaterialsSection'
import { SocialLinksSection, type SocialLinksSectionProps } from './SocialLinksSection'
import { StorySection } from './StorySection'
import { WaitlistSection } from './WaitlistSection'
import type { Media } from '@/payload-types'

type MediaRelation = (number | null) | Media

type LandingContent = {
  hero?: {
    backgroundImageDesktop?: MediaRelation
    backgroundImageMobile?: MediaRelation
    title?: string | null
    subtitle?: string | null
    launchDate?: string | null
    launchTime?: string | null
    launchTimezone?: string | null
  } | null
  featuredProducts?: {
    items?: FeaturedProductItem[] | null
  } | null
  waitlist?: {
    image?: MediaRelation
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
    image?: MediaRelation
  } | null
  designs?: {
    title?: string | null
    content?: string | null
    image?: MediaRelation
  } | null
  socialLinks?: SocialLinksSectionProps | null
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
  const materialsSectionProps = {
    title: landingContent?.materials?.title,
    content: landingContent?.materials?.content,
    image: landingContent?.materials?.image,
  } as MaterialsSectionProps
  const designsSectionProps = {
    title: landingContent?.designs?.title,
    content: landingContent?.designs?.content,
    image: landingContent?.designs?.image,
  } as DesignsSectionProps

  return (
    <div>
      <HeroSection
        backgroundImageDesktop={landingContent?.hero?.backgroundImageDesktop}
        backgroundImageMobile={landingContent?.hero?.backgroundImageMobile}
        title={landingContent?.hero?.title ?? page.title}
        subtitle={landingContent?.hero?.subtitle}
        launchDate={landingContent?.hero?.launchDate}
        launchTime={landingContent?.hero?.launchTime}
        launchTimezone={landingContent?.hero?.launchTimezone}
      />

      <FeaturedProductsSection
        items={landingContent?.featuredProducts?.items}
        launchDate={landingContent?.hero?.launchDate}
        launchTime={landingContent?.hero?.launchTime}
        launchTimezone={landingContent?.hero?.launchTimezone}
      />

      <WaitlistSection
        video={landingContent?.waitlist?.image}
        title={landingContent?.waitlist?.title}
        description={landingContent?.waitlist?.description}
        buttonLabel={landingContent?.waitlist?.buttonLabel}
        successMessage={landingContent?.waitlist?.successMessage}
      />

      <StorySection
        title={landingContent?.story?.title}
        introduction={landingContent?.story?.introduction}
      />

      <MaterialsSection {...materialsSectionProps} />

      <DesignsSection {...designsSectionProps} />

      <SocialLinksSection
        title={landingContent?.socialLinks?.title}
        items={landingContent?.socialLinks?.items}
      />
    </div>
  )
}
