import Link from 'next/link'
import { DoubleRule } from '@/components/double-rule'
import { ArrowUp } from '@/components/icons'
import { ExternalLink } from '@/components/external-link'
import { siteConfig } from '@/lib/site-config'

const FOOTER_LINKS = [
  { href: '/experiments', label: 'Experiments' },
  { href: '/experiments?view=index', label: 'Index' },
  { href: '/categories', label: 'Categories' },
  { href: '/archive', label: 'Archive' },
  { href: '/about', label: 'About' },
]

const linkClass =
  'label inline-flex min-h-11 min-w-11 items-center text-fg-muted hover:text-fg focus-visible:text-fg md:min-h-8'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="frame">
        <DoubleRule />
        <div className="rule-grid">
          <div className="cell md:col-span-6">
            <p className="label text-fg">{siteConfig.name}</p>
            <p className="mt-3 max-w-[44ch] text-fg-muted">
              Every entry here is a folder of Markdown and media in a GitHub repository. Publishing
              is a commit.
            </p>
          </div>

          <nav aria-label="Footer" className="cell md:col-span-3">
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cell md:col-span-3">
            <ul>
              <li>
                <ExternalLink href={siteConfig.links.linkedin} className={linkClass}>
                  LinkedIn
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={siteConfig.links.github} className={linkClass}>
                  GitHub
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={siteConfig.links.portfolio} className={linkClass}>
                  Portfolio
                </ExternalLink>
              </li>
              {siteConfig.links.email ? (
                <li>
                  <a href={`mailto:${siteConfig.links.email}`} className={linkClass}>
                    Email
                  </a>
                </li>
              ) : null}
              <li>
                <a href="#top" className={`${linkClass} gap-2`}>
                  Return to top
                  <ArrowUp />
                </a>
              </li>
            </ul>
          </div>

          <p className="cell label text-fg-muted">
            © {year} {siteConfig.author}. A living archive, never finished.
          </p>
        </div>
      </div>
    </footer>
  )
}
