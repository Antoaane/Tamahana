import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const SHARK_TEETH_MASK_STYLE = {
  WebkitMaskImage: 'url(/svgs/polynesian-shark-teeth.svg)',
  maskImage: 'url(/svgs/polynesian-shark-teeth.svg)',
  WebkitMaskPosition: 'center top',
  maskPosition: 'center top',
  WebkitMaskRepeat: 'repeat-x',
  maskRepeat: 'repeat-x',
  WebkitMaskSize: 'auto 100%',
  maskSize: 'auto 100%',
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const hasNavItems = navItems.length > 0
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto isolate overflow-hidden border-t border-palette-4/45 bg-palette-2 font-cloud-lucent text-palette-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-palette-4/65"
        style={SHARK_TEETH_MASK_STYLE}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/svgs/polynesian-patterns.svg')] bg-repeat opacity-[0.0125] [background-size:clamp(48rem,95vw,120rem)_auto]"
      />

      <div className="container relative py-12 md:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-[36rem]">
            <Link aria-label="Accueil Tamahana" className="inline-flex items-center" href="/">
              <Logo className="h-14 w-auto max-w-none" src="/images/logo-tamahana.png" />
            </Link>
            <p className="mt-5 font-baskervville text-lg italic text-palette-3/95">
              Artisanat polynésien, matières sélectionnées et créations en édition limitée.
            </p>
          </div>

          {hasNavItems ? (
            <nav aria-label="Navigation de pied de page" className="lg:justify-self-end">
              <p className="font-cinzel text-xs uppercase tracking-[0.22em] text-palette-3/80">
                Navigation
              </p>
              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {navItems.map(({ link }, i) => {
                  return (
                    <CMSLink
                      className="font-baskervville text-lg text-palette-3 transition-colors hover:text-palette-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/45"
                      key={i}
                      {...link}
                    />
                  )
                })}
              </div>
            </nav>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-palette-4/45 pt-6 text-sm text-palette-3/85 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Tamahana. Tous droits réservés.</p>
          <Link
            className="w-fit font-baskervville text-base text-palette-3 transition-colors hover:text-palette-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-3/45"
            href="/"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </footer>
  )
}
