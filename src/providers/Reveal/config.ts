export const revealConfig = {
  delayMs: 300,
  triggerOffsetVh: 15,
  heroDelayMultiplier: 2,
  viewFactor: 0.12,
  baseViewOffset: {
    top: 24,
    right: 0,
    left: 0,
  },
} as const

export const getBottomTriggerOffsetPxFromVh = (viewportHeight: number) =>
  Math.round((viewportHeight * revealConfig.triggerOffsetVh) / 100)

export const getHeroDelayMs = () =>
  Math.round(revealConfig.delayMs * revealConfig.heroDelayMultiplier)
