import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { CMSLinkType } from '@/components/Link'
import type { Media } from '@/payload-types'

export type LegacyHero = {
  type?: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | null
  links?:
    | Array<{
        link?: CMSLinkType
      }>
    | null
  media?: Media | number | string | null
  richText?: DefaultTypedEditorState | null
}
