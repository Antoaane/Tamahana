export const FEATURED_PRODUCT_IMAGE_BACKGROUND_OPTIONS = [
  {
    label: 'Palette 1 vers 2',
    value: 'palette-1-2',
    cssValue:
      'linear-gradient(150deg, var(--palette-1, #fff6e5) 0%, var(--palette-2, #fffcf1) 100%)',
  },
  {
    label: 'Palette 2 vers 3',
    value: 'palette-2-3',
    cssValue:
      'linear-gradient(150deg, var(--palette-2, #fffcf1) 0%, var(--palette-3, #7a6a4b) 100%)',
  },
  {
    label: 'Palette 3 vers 4',
    value: 'palette-3-4',
    cssValue:
      'linear-gradient(150deg, var(--palette-3, #7a6a4b) 0%, var(--palette-4, #c3b282) 100%)',
  },
  {
    label: 'Palette 4 vers 5',
    value: 'palette-4-5',
    cssValue:
      'linear-gradient(150deg, var(--palette-4, #c3b282) 0%, var(--palette-5, #ffcb6c) 100%)',
  },
  {
    label: 'Palette 5 vers 6',
    value: 'palette-5-6',
    cssValue:
      'linear-gradient(150deg, var(--palette-5, #ffcb6c) 0%, var(--palette-6, #ff57a2) 100%)',
  },
  {
    label: 'Palette 6 vers 7',
    value: 'palette-6-7',
    cssValue:
      'linear-gradient(150deg, var(--palette-6, #ff57a2) 0%, var(--palette-7, #f8e088) 100%)',
  },
  {
    label: 'Palette 7 vers 8',
    value: 'palette-7-8',
    cssValue:
      'linear-gradient(150deg, var(--palette-7, #f8e088) 0%, var(--palette-8, #ffd6e4) 100%)',
  },
  {
    label: 'Palette 8 vers 1',
    value: 'palette-8-1',
    cssValue:
      'linear-gradient(150deg, var(--palette-8, #ffd6e4) 0%, var(--palette-1, #fff6e5) 100%)',
  },
] as const

const LEGACY_FEATURED_PRODUCT_IMAGE_BACKGROUND_OPTIONS = [
  {
    label: 'Legacy - Sable',
    value: 'sable',
    cssValue:
      'linear-gradient(150deg, var(--palette-1, #fff6e5) 0%, var(--palette-2, #fffcf1) 100%)',
  },
  {
    label: 'Legacy - Ivoire',
    value: 'ivoire',
    cssValue:
      'linear-gradient(150deg, var(--palette-2, #fffcf1) 0%, var(--palette-3, #7a6a4b) 100%)',
  },
  {
    label: 'Legacy - Lagon',
    value: 'lagon',
    cssValue:
      'linear-gradient(150deg, var(--palette-7, #f8e088) 0%, var(--palette-8, #ffd6e4) 100%)',
  },
  {
    label: 'Legacy - Nuit',
    value: 'nuit',
    cssValue:
      'linear-gradient(150deg, var(--palette-3, #7a6a4b) 0%, var(--palette-4, #c3b282) 100%)',
  },
] as const

export const FEATURED_PRODUCT_IMAGE_BACKGROUND_STORAGE_OPTIONS = [
  ...FEATURED_PRODUCT_IMAGE_BACKGROUND_OPTIONS,
  ...LEGACY_FEATURED_PRODUCT_IMAGE_BACKGROUND_OPTIONS,
] as const

export const FEATURED_PRODUCT_IMAGE_BACKGROUND_LEGACY_VALUES = new Set(
  LEGACY_FEATURED_PRODUCT_IMAGE_BACKGROUND_OPTIONS.map((option) => option.value),
) as Set<string>

export type FeaturedProductImageBackground =
  (typeof FEATURED_PRODUCT_IMAGE_BACKGROUND_STORAGE_OPTIONS)[number]['value']

export const DEFAULT_FEATURED_PRODUCT_IMAGE_BACKGROUND: FeaturedProductImageBackground = 'palette-1-2'

export const FEATURED_PRODUCT_IMAGE_BACKGROUND_CSS: Record<
  FeaturedProductImageBackground,
  string
> = FEATURED_PRODUCT_IMAGE_BACKGROUND_STORAGE_OPTIONS.reduce<
  Record<FeaturedProductImageBackground, string>
>((accumulator, option) => {
  accumulator[option.value] = option.cssValue
  return accumulator
}, {} as Record<FeaturedProductImageBackground, string>)
