import { getPayload, type Payload } from 'payload'
import type { NextRequest } from 'next/server'
import configPromise from '@payload-config'

const MAX_PRODUCT_KEY_LENGTH = 200

type UpdateLikesRequestBody = {
  action?: 'like' | 'unlike'
  productKey?: string
}

const isValidProductKey = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0 && value.length <= MAX_PRODUCT_KEY_LENGTH
}

const toSafeLikeCount = (value: unknown): number => {
  const normalized = typeof value === 'string' ? Number(value) : value
  if (typeof normalized !== 'number' || !Number.isFinite(normalized)) return 0
  return Math.max(0, Math.floor(normalized))
}

const getLikesForKey = async (payload: Payload, productKey: string) => {
  const result = await payload.find({
    collection: 'product-likes',
    where: {
      productKey: {
        equals: productKey,
      },
    },
    limit: 1,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  const doc = result.docs[0]
  if (!doc) return null

  return {
    id: doc.id,
    likes: toSafeLikeCount(doc.likes),
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const productKey = searchParams.get('productKey')

  if (!isValidProductKey(productKey)) {
    return Response.json({ error: 'Invalid product key.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const likeDoc = await getLikesForKey(payload, productKey)

    return Response.json(
      {
        likes: likeDoc?.likes ?? 0,
        productKey,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch {
    return Response.json({ error: 'Unable to retrieve likes.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: UpdateLikesRequestBody

  try {
    body = (await req.json()) as UpdateLikesRequestBody
  } catch {
    return Response.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const productKey = body.productKey
  const action = body.action

  if (!isValidProductKey(productKey)) {
    return Response.json({ error: 'Invalid product key.' }, { status: 400 })
  }

  if (action !== 'like' && action !== 'unlike') {
    return Response.json({ error: 'Invalid action.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const existingDoc = await getLikesForKey(payload, productKey)

    if (!existingDoc) {
      if (action === 'unlike') {
        return Response.json({ likes: 0, productKey })
      }

      try {
        const createdDoc = await payload.create({
          collection: 'product-likes',
          data: {
            productKey,
            likes: 1,
          },
          depth: 0,
          overrideAccess: true,
        })

        return Response.json({
          likes: toSafeLikeCount(createdDoc.likes),
          productKey,
        })
      } catch {
        // If another request created the row in the meantime, retry as an update.
        const latestDoc = await getLikesForKey(payload, productKey)
        if (!latestDoc) {
          throw new Error('Failed to create likes row')
        }

        const updatedDoc = await payload.update({
          collection: 'product-likes',
          id: latestDoc.id,
          data: {
            likes: latestDoc.likes + 1,
          },
          depth: 0,
          overrideAccess: true,
        })

        return Response.json({
          likes: toSafeLikeCount(updatedDoc.likes),
          productKey,
        })
      }
    }

    const delta = action === 'like' ? 1 : -1
    const nextLikes = Math.max(0, existingDoc.likes + delta)

    const updatedDoc = await payload.update({
      collection: 'product-likes',
      id: existingDoc.id,
      data: {
        likes: nextLikes,
      },
      depth: 0,
      overrideAccess: true,
    })

    return Response.json({
      likes: toSafeLikeCount(updatedDoc.likes),
      productKey,
    })
  } catch {
    return Response.json({ error: 'Unable to update likes.' }, { status: 500 })
  }
}
