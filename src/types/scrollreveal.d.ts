declare module 'scrollreveal' {
  export interface ScrollRevealInstance {
    destroy(): void
    reveal(target: string, options?: Record<string, unknown>): void
    sync(): void
  }

  export interface ScrollRevealOptions {
    mobile?: boolean
    reset?: boolean
    viewFactor?: number
    viewOffset?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    [key: string]: unknown
  }

  export interface ScrollRevealFactory {
    (options?: ScrollRevealOptions): ScrollRevealInstance
  }

  const ScrollReveal: ScrollRevealFactory
  export default ScrollReveal
}
