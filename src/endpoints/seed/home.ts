import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { paragraphRichText } from './richText'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    title: 'Accueil',
    slug: 'home',
    pageType: 'landing',
    published: true,
    _status: 'published',
    seo: {
      metaTitle: 'Tamahana',
      metaDescription: 'Landing page Tamahana',
      metaImage: metaImage.id,
    },
    landingContent: {
      hero: {
        backgroundImageDesktop: heroImage.id,
        backgroundImageMobile: heroImage.id,
        title: 'Tamahana',
        subtitle: 'Le reconfort du Pacifique',
        launchDate: new Date().toISOString(),
      },
      featuredProducts: {
        items: [
          {
            image: metaImage.id,
            name: 'Nom de la piece',
            collection: 'Collection',
            price: '45,95 EUR',
            link: '/posts',
          },
        ],
      },
      waitlist: {
        image: metaImage.id,
        title: 'Liste d\'attente',
        description: paragraphRichText('Inscrivez-vous pour etre informe du lancement.'),
        buttonLabel: 'Je m\'inscris',
        successMessage: paragraphRichText('Merci, votre inscription a bien ete prise en compte.'),
      },
      story: {
        title: 'Notre histoire',
        introduction: paragraphRichText('Une marque creee entre la Nouvelle-Caledonie et la France.'),
      },
      materials: {
        title: 'Nos matieres',
        content: paragraphRichText('Des matieres selectionnees pour le confort et la durabilite.'),
        image: metaImage.id,
      },
      designs: {
        title: 'Nos designs',
        content: paragraphRichText('Des designs penses pour le quotidien et l\'identite.'),
        image: metaImage.id,
      },
    },
  }
}
