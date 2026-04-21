import { RequiredDataFromCollectionSlug } from 'payload'

export const contact: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    title: 'Contact',
    slug: 'contact',
    pageType: 'standard',
    published: true,
    _status: 'published',
    seo: {
      metaTitle: 'Contact',
      metaDescription: 'Page de contact',
    },
  }
}
