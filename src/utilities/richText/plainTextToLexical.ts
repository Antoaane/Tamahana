import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const plainTextToLexical = (text: string): DefaultTypedEditorState => {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export const coerceLegacyTextToLexical = (value: unknown) => {
  if (typeof value === 'string') {
    const normalized = value.trim()
    if (!normalized) return null

    // If a legacy value already contains serialized Lexical JSON, restore it as an object.
    if (normalized.startsWith('{') && normalized.includes('"root"')) {
      try {
        const parsed = JSON.parse(normalized) as unknown
        if (parsed && typeof parsed === 'object' && 'root' in parsed) {
          return parsed
        }
      } catch {
        // Fall back to plain text conversion below.
      }
    }

    return plainTextToLexical(value)
  }

  return value
}
