export const scrollRevealConfig = {
  delayMs: 300,
  triggerOffsetVw: 20,
  baseViewOffset: {
    top: 24,
    right: 0,
    left: 0,
  },
} as const

export const getBottomTriggerOffsetPx = (viewportWidth: number) =>
  Math.round((viewportWidth * scrollRevealConfig.triggerOffsetVw) / 100)
