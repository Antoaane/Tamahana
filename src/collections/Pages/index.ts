import type { CollectionConfig, FieldHook } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  DEFAULT_FEATURED_PRODUCT_IMAGE_BACKGROUND,
  FEATURED_PRODUCT_IMAGE_BACKGROUND_LEGACY_VALUES,
  FEATURED_PRODUCT_IMAGE_BACKGROUND_STORAGE_OPTIONS,
} from '../../constants/featuredProductImageBackgrounds'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { coerceLegacyTextToLexical } from '../../utilities/richText/plainTextToLexical'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

const legacyRichTextHooks = {
  afterRead: [(({ value }) => coerceLegacyTextToLexical(value)) as FieldHook],
  beforeValidate: [(({ value }) => coerceLegacyTextToLexical(value)) as FieldHook],
}

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
    pageType: true,
    published: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'pageType', 'published', 'updatedAt'],
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
      label: 'Nom de la page',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL de la page',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'pageType',
      type: 'select',
      label: 'Type de page',
      required: true,
      defaultValue: 'standard',
      options: [
        {
          label: 'Page de lancement',
          value: 'landing',
        },
        {
          label: 'Page standard',
          value: 'standard',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Page publiée',
      defaultValue: false,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Référencement',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Titre SEO',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Description SEO',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Image SEO',
        },
      ],
    },
    {
      name: 'landingContent',
      type: 'group',
      label: 'Contenu de la landing page',
      admin: {
        condition: (data) => data?.pageType === 'landing',
      },
      fields: [
        {
          type: 'collapsible',
          label: 'Section principale',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'backgroundImageDesktop',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image de fond desktop',
                },
                {
                  name: 'backgroundImageMobile',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image de fond mobile',
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre principal',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Sous-titre principal',
                },
                {
                  name: 'launchDate',
                  type: 'date',
                  label: 'Date de lancement',
                },
                {
                  name: 'launchTime',
                  type: 'text',
                  label: 'Heure de lancement',
                  admin: {
                    description: 'Format 24h (HH:mm), ex. 18:30',
                    placeholder: '18:30',
                  },
                },
                {
                  name: 'launchTimezone',
                  type: 'select',
                  label: 'Fuseau horaire',
                  defaultValue: 'Europe/Paris',
                  options: [
                    {
                      label: 'Europe/Paris',
                      value: 'Europe/Paris',
                    },
                    {
                      label: 'UTC',
                      value: 'UTC',
                    },
                    {
                      label: 'America/New_York',
                      value: 'America/New_York',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Section produits mis en avant',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'featuredProducts',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  label: 'Produits',
                  labels: {
                    singular: 'Produit',
                    plural: 'Produits',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Image',
                    },
                    {
                      name: 'imageBackground',
                      type: 'select',
                      enumName: 'feat_prod_item_img_bg',
                      label: 'Arriere-plan pour PNG transparent',
                      defaultValue: DEFAULT_FEATURED_PRODUCT_IMAGE_BACKGROUND,
                      options: FEATURED_PRODUCT_IMAGE_BACKGROUND_STORAGE_OPTIONS.map((option) => ({
                        label: option.label,
                        value: option.value,
                      })),
                      filterOptions: ({ options, siblingData }) => {
                        const currentValue =
                          siblingData &&
                          typeof siblingData === 'object' &&
                          'imageBackground' in siblingData &&
                          typeof siblingData.imageBackground === 'string'
                            ? siblingData.imageBackground
                            : null

                        return options.filter((option) => {
                          const optionValue = typeof option === 'string' ? option : option.value
                          if (!FEATURED_PRODUCT_IMAGE_BACKGROUND_LEGACY_VALUES.has(optionValue)) {
                            return true
                          }

                          return currentValue === optionValue
                        })
                      },
                      admin: {
                        isClearable: false,
                        description:
                          "Choisis un gradient lie aux palettes du site. Le fond est applique uniquement quand l'image est un PNG transparent.",
                      },
                    },
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Nom du produit',
                    },
                    {
                      name: 'collection',
                      type: 'text',
                      label: 'Collection',
                    },
                    {
                      name: 'price',
                      type: 'text',
                      label: 'Prix',
                    },
                    {
                      name: 'link',
                      type: 'text',
                      label: 'Lien',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: "Section liste d'attente",
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'waitlist',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Vidéo',
                  filterOptions: {
                    mimeType: {
                      contains: 'video',
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre',
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Description',
                  hooks: legacyRichTextHooks,
                },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  label: 'Texte du bouton',
                },
                {
                  name: 'successMessage',
                  type: 'richText',
                  label: 'Message de confirmation',
                  hooks: legacyRichTextHooks,
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Section histoire',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'story',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre',
                },
                {
                  name: 'introduction',
                  type: 'richText',
                  label: 'Introduction',
                  hooks: legacyRichTextHooks,
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Section matières',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'materials',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre',
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Contenu',
                  hooks: legacyRichTextHooks,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Section designs',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'designs',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre',
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Contenu',
                  hooks: legacyRichTextHooks,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Section reseaux sociaux',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre',
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Reseaux',
                  labels: {
                    singular: 'Reseau',
                    plural: 'Reseaux',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Nom affiche',
                      required: true,
                    },
                    {
                      name: 'link',
                      type: 'text',
                      label: 'Lien',
                      required: true,
                      admin: {
                        placeholder: 'https://instagram.com/...',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icone',
                      defaultValue: 'website',
                      options: [
                        {
                          label: 'Instagram',
                          value: 'instagram',
                        },
                        {
                          label: 'Facebook',
                          value: 'facebook',
                        },
                        {
                          label: 'X',
                          value: 'x',
                        },
                        {
                          label: 'TikTok',
                          value: 'tiktok',
                        },
                        {
                          label: 'YouTube',
                          value: 'youtube',
                        },
                        {
                          label: 'LinkedIn',
                          value: 'linkedin',
                        },
                        {
                          label: 'Site web',
                          value: 'website',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
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
