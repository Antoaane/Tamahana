export const scrollRevealConfig = {
  delayMs: 300,
  triggerOffsetVh: 15,
  heroDelayMultiplier: 2,
  baseViewOffset: {
    top: 24,
    right: 0,
    left: 0,
  },
} as const

export const getBottomTriggerOffsetPxFromVh = (viewportHeight: number) =>
  Math.round((viewportHeight * scrollRevealConfig.triggerOffsetVh) / 100)

export const getHeroDelayMs = () =>
  Math.round(scrollRevealConfig.delayMs * scrollRevealConfig.heroDelayMultiplier)
