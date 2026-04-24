import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type TextContent = DefaultTypedEditorState | string | null | undefined

export const isLexicalContent = (value: TextContent): value is DefaultTypedEditorState => {
  return Boolean(value && typeof value === 'object' && 'root' in value)
}
