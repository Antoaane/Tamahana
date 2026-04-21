import type { Post } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { CollectionArchive } from '@/components/CollectionArchive'

type ArchiveBlockProps = {
  categories?:
    | Array<
        | {
            id: number | string
          }
        | number
        | string
      >
    | null
  id?: string
  introContent?: DefaultTypedEditorState | null
  limit?: number | null
  populateBy?: 'collection' | 'selection' | null
  selectedDocs?:
    | Array<{
        value?:
          | Post
          | {
              id: number | string
            }
          | number
          | string
          | null
      }>
    | null
}

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (
          post.value &&
          typeof post.value === 'object' &&
          'slug' in post.value &&
          'title' in post.value
        ) {
          return post.value as Post
        }
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
