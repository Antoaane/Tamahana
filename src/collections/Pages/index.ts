import type { CollectionConfig, Field } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const mediaField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
})

const landingPageFields: Field[] = [
  {
    name: 'landingPage',
    label: "Landing page (maquette finale)",
    type: 'group',
    fields: [
      {
        name: 'heroSection',
        label: 'Section Hero',
        type: 'group',
        fields: [
          mediaField('backgroundImage', 'Image de fond'),
          {
            name: 'brandMark',
            label: 'Monogramme / logo',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'brandName',
            label: 'Nom de marque',
            type: 'text',
          },
          {
            name: 'tagline',
            label: 'Signature',
            type: 'text',
          },
          {
            name: 'navigationLinks',
            label: 'Liens de navigation',
            type: 'array',
            minRows: 0,
            maxRows: 4,
            labels: {
              singular: 'Lien',
              plural: 'Liens',
            },
            fields: [
              {
                name: 'label',
                label: 'Texte',
                type: 'text',
                required: true,
              },
              {
                name: 'targetId',
                label: 'ID de section cible (ancre)',
                type: 'text',
                required: true,
                admin: {
                  description: 'Exemple: preorder, histoire, contact',
                },
              },
            ],
          },
        ],
      },
      {
        name: 'dropSection',
        label: 'Section Drop / compte à rebours + pièces',
        type: 'group',
        fields: [
          {
            name: 'countdownLabel',
            label: 'Titre du compte à rebours',
            type: 'text',
          },
          {
            name: 'countdownTargetDate',
            label: 'Date cible du compte à rebours',
            type: 'date',
            admin: {
              date: {
                pickerAppearance: 'dayAndTime',
              },
            },
          },
          {
            name: 'pieces',
            label: 'Pièces mises en avant',
            type: 'array',
            minRows: 0,
            labels: {
              singular: 'Pièce',
              plural: 'Pièces',
            },
            fields: [
              mediaField('image', 'Image de la pièce'),
              {
                name: 'name',
                label: 'Nom de la pièce',
                type: 'text',
                required: true,
              },
              {
                name: 'collectionName',
                label: 'Collection',
                type: 'text',
              },
              {
                name: 'priceLabel',
                label: 'Prix affiché',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'newsletterSection',
        label: 'Section inscription / précommande',
        type: 'group',
        fields: [
          mediaField('sideImage', 'Image latérale'),
          {
            name: 'icon',
            label: 'Icône',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'headline',
            label: 'Titre',
            type: 'text',
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
          },
          {
            name: 'firstNamePlaceholder',
            label: 'Placeholder prénom',
            type: 'text',
          },
          {
            name: 'emailPlaceholder',
            label: 'Placeholder email',
            type: 'text',
          },
          {
            name: 'submitLabel',
            label: 'Libellé du bouton',
            type: 'text',
          },
        ],
      },
      {
        name: 'storySection',
        label: 'Section histoire / matières / designs',
        type: 'group',
        fields: [
          {
            name: 'heading',
            label: 'Titre de section',
            type: 'text',
          },
          {
            name: 'introParagraphs',
            label: 'Paragraphes introductifs',
            type: 'array',
            minRows: 0,
            labels: {
              singular: 'Paragraphe',
              plural: 'Paragraphes',
            },
            fields: [
              {
                name: 'text',
                type: 'textarea',
                required: true,
              },
            ],
          },
          {
            name: 'featureRows',
            label: 'Blocs alternés (image + texte)',
            type: 'array',
            minRows: 0,
            labels: {
              singular: 'Bloc',
              plural: 'Blocs',
            },
            fields: [
              {
                name: 'title',
                label: 'Titre',
                type: 'text',
                required: true,
              },
              {
                name: 'paragraphs',
                label: 'Paragraphes',
                type: 'array',
                minRows: 1,
                fields: [
                  {
                    name: 'text',
                    label: 'Texte',
                    type: 'textarea',
                    required: true,
                  },
                ],
              },
              mediaField('image', 'Image du bloc'),
            ],
          },
        ],
      },
    ],
  },
]

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          label: 'Landing page',
          fields: landingPageFields,
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
