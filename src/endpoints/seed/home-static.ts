import type { RequiredDataFromCollectionSlug } from 'payload'

export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  title: 'Home',
  slug: 'home',
  pageType: 'landing',
  published: true,
  _status: 'published',
  seo: {
    metaTitle: 'Tamahana',
    metaDescription: 'Landing page Tamahana',
  },
  landingContent: {
    hero: {
      title: 'Tamahana',
      subtitle: 'Le reconfort du Pacifique',
    },
    featuredProducts: {
      items: [
        {
          name: 'Nom de la piece',
          price: '45,95 EUR',
        },
      ],
    },
    waitlist: {
      title: 'Liste d\'attente',
      description: 'Inscrivez-vous pour etre informe du lancement.',
      buttonLabel: 'Je m\'inscris',
      successMessage: 'Merci pour votre inscription.',
    },
    story: {
      title: 'Notre histoire',
      introduction: 'Presentation de la marque.',
    },
    materials: {
      title: 'Nos matieres',
      content: 'Informations sur les matieres.',
    },
    designs: {
      title: 'Nos designs',
      content: 'Informations sur les designs.',
    },
  },
}
