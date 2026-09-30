import Link from 'next/link'
import { ExternalLink } from '@/components/external-link'
import { MobileMenu } from '@/components/mobile-menu'
import { SiteNav } from '@/components/site-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/site-config'

/** Sticky, compact, divided by 1px rules: wordmark · nav · (spacer) · theme · GitHub · year. */
export function SiteHeader() {
  const year = new Date().getFullYear()

  return (
    <header className="sticky top-0 z-40 border-b bg-bg">
      <div className="frame flex h-12 items-stretch">
        <Link
          href="/"
          className="label flex items-center px-[var(--pad)] font-medium text-fg hover:bg-surface focus-visible:bg-surface md:border-r"
        >
          <span className="md:hidden">{siteConfig.shortName}</span>
          <span className="hidden md:inline">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <SiteNav variant="bar" />
        </nav>

        <div className="ml-auto hidden items-stretch md:flex">
          <ThemeToggle className="border-l" />
          <ExternalLink
            href={siteConfig.links.github}
            className="label border-l px-4 text-fg hover:bg-surface focus-visible:bg-surface"
          >
            GitHub
          </ExternalLink>
          <span className="label flex items-center border-l px-4 text-fg-muted">{year}</span>
        </div>

        <div className="ml-auto flex md:hidden">
          <MobileMenu year={year} />
        </div>
      </div>
    </header>
  )
}
