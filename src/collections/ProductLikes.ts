import type { CollectionConfig } from 'payload'

const denyAccess = () => false

export const ProductLikes: CollectionConfig = {
  slug: 'product-likes',
  access: {
    create: denyAccess,
    delete: denyAccess,
    read: denyAccess,
    update: denyAccess,
  },
  admin: {
    hidden: true,
    useAsTitle: 'productKey',
  },
  fields: [
    {
      name: 'productKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'likes',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
  ],
}
