import { ExternalLink } from '@/components/external-link'
import { Mdx } from '@/components/mdx'
import { PageHeader, Slash } from '@/components/page-header'
import { getAboutSource } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'A short note on who is behind the archive and why it exists: curiosity about technology, AI, interaction and digital products.',
  path: '/about',
})

const linkClass = 'label inline-flex min-h-11 items-center text-accent underline underline-offset-4'

export default function AboutPage() {
  const { github, email } = siteConfig.links

  return (
    <div className="frame">
      <PageHeader
        title={
          <>
            <Slash />
            About
          </>
        }
      />
      <div className="rule-grid">
        <div className="cell py-10 md:py-16 lg:col-span-9">
          <div className="prose-about">
            <Mdx source={getAboutSource()} />
          </div>
        </div>
        <aside aria-label="Links" className="cell flex flex-col gap-1 py-10 md:py-16 lg:col-span-3">
          <p className="label mb-2 text-fg-muted">Elsewhere</p>
          <ExternalLink href={github} className={linkClass}>
            GitHub
          </ExternalLink>
          {email ? (
            <a href={`mailto:${email}`} className={linkClass}>
              Email
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
