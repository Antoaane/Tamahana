import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const hasPostMeta = (
  value: Partial<Page> | Partial<Post> | null,
): value is Partial<Post> & { meta?: Post['meta'] } => {
  return Boolean(value && 'meta' in value)
}

const hasPageSeo = (
  value: Partial<Page> | Partial<Post> | null,
): value is Partial<Page> & { seo?: Page['seo'] } => {
  return Boolean(value && 'seo' in value)
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  let metaTitle: string | null | undefined
  let metaDescription: string | null | undefined
  let metaImage: Media | Config['db']['defaultIDType'] | null | undefined

  if (hasPostMeta(doc)) {
    metaTitle = doc.meta?.title
    metaDescription = doc.meta?.description
    metaImage = doc.meta?.image
  } else if (hasPageSeo(doc)) {
    metaTitle = doc.seo?.metaTitle
    metaDescription = doc.seo?.metaDescription
    metaImage = doc.seo?.metaImage
  }

  const ogImage = getImageURL(metaImage)

  const title = metaTitle ? metaTitle + ' | Payload Website Template' : 'Payload Website Template'

  return {
    description: metaDescription,
    openGraph: mergeOpenGraph({
      description: metaDescription || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
