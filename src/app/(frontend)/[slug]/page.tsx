import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LandingPage, type LandingPageData } from '@/components/landing/LandingPage'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type PageSEO = {
  metaTitle?: string | null
  metaDescription?: string | null
} | null

type PageDocument = LandingPageData & {
  slug?: string | null
  pageType?: 'landing' | 'standard' | null
  seo?: PageSEO
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  let page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  if (page.pageType !== 'landing') {
    return null
  }

  return (
    <div>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <LandingPage page={page} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return {
    title: page?.seo?.metaTitle || page?.title || undefined,
    description: page?.seo?.metaDescription || undefined,
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs?.[0] as PageDocument | undefined) || null
})
