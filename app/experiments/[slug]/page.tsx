import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from '@/components/icons'
import { ExperimentIndexHead, ExperimentRow } from '@/components/experiment-row'
import { DoubleRule } from '@/components/double-rule'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentVisual } from '@/components/experiment-visual'
import { ExternalLink } from '@/components/external-link'
import { HeroBanner } from '@/components/hero-banner'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { SectionLabel } from '@/components/section-label'
import { getCollection, getExperiment } from '@/lib/content'
import { getAdjacent, getMoreInCategory } from '@/lib/content/collection'
import { splitSections, stripFigures } from '@/lib/content/parse'
import { formatDate } from '@/lib/format'
import { demoLabel } from '@/lib/links'
import { experimentJsonLd, pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'
import { absoluteUrl } from '@/lib/site-url'

// Unknown slugs, drafts included, get a real 404 status rather than a streamed soft-404.
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getCollection().experiments.map((experiment) => ({ slug: experiment.slug }))
}

/** The supplied ogImage, or the generated type-led card. */
function ogImagePath(slug: string, ogImage?: { src: string }): string {
  return ogImage?.src ?? `/og/${slug}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const experiment = getExperiment(slug)
  if (!experiment) return {}

  return pageMetadata({
    title: experiment.title,
    description: experiment.description,
    path: `/experiments/${experiment.slug}`,
    image: ogImagePath(experiment.slug, experiment.ogImage),
    article: {
      publishedTime: experiment.date,
      modifiedTime: experiment.updated,
      tags: experiment.tags,
    },
  })
}

const linkClass =
  'label min-h-11 text-accent underline underline-offset-4 md:min-h-0 inline-flex items-center'

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params
  const experiment = getExperiment(slug)
  if (!experiment) notFound()

  const { experiments } = getCollection()
  const { previous, next } = getAdjacent(experiments, experiment.slug)
  const related = getMoreInCategory(experiments, experiment)
  const { lead, sections: authored } = splitSections(
    siteConfig.showImages ? experiment.body : stripFigures(experiment.body),
  )

  // Frontmatter stack is shown in the details row, so a "## Stack" section would only repeat it.
  const sections = authored.filter(
    (section) => !(section.slug === 'stack' && experiment.stack.length > 0),
  )
  const scope = { slug: experiment.slug, folder: experiment.folder }

  const updated =
    experiment.updated && experiment.updated !== experiment.date ? experiment.updated : null

  // What the entry is about, in three short columns. Empty ones are left out.
  const details: { label: string; content: React.ReactNode }[] = [
    {
      label: 'Category',
      content: (
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {experiment.categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex min-h-11 items-center underline decoration-border-strong underline-offset-4 hover:decoration-fg focus-visible:decoration-fg md:min-h-0"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
  ]
  if (experiment.stack.length > 0) {
    details.push({ label: 'Built with', content: experiment.stack.join(', ') })
  }
  if (experiment.tags.length > 0) {
    details.push({ label: 'Tags', content: experiment.tags.join(', ') })
  }
  const detailSpan =
    details.length === 3
      ? 'md:col-span-4'
      : details.length === 2
        ? 'md:col-span-6'
        : 'md:col-span-12'

  return (
    <article className="frame">
      <JsonLd
        data={experimentJsonLd(
          experiment,
          absoluteUrl(ogImagePath(experiment.slug, experiment.ogImage)),
        )}
      />

      <div className="rule-grid">
        <div className="cell py-3">
          <Link
            href="/experiments"
            className="label group inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg focus-visible:text-fg md:min-h-0"
          >
            <ArrowLeft className="transition-transform duration-150 group-hover:-translate-x-[3px] group-focus-visible:-translate-x-[3px]" />
            All experiments
          </Link>
        </div>
      </div>

      <HeroBanner
        kicker={<ExperimentMeta experiment={experiment} />}
        title={experiment.title}
        intro={<p>{experiment.description}</p>}
        meta={
          updated ? (
            <p className="label text-fg-muted">
              Updated <time dateTime={updated}>{formatDate(updated)}</time>
            </p>
          ) : null
        }
        actions={
          experiment.demoUrl || experiment.githubUrl ? (
            <div className="flex flex-wrap items-center gap-x-8">
              {experiment.demoUrl ? (
                <ExternalLink href={experiment.demoUrl} className={linkClass}>
                  {demoLabel(experiment.demoUrl)}
                </ExternalLink>
              ) : null}
              {experiment.githubUrl ? (
                <ExternalLink href={experiment.githubUrl} className={linkClass}>
                  Source on GitHub
                </ExternalLink>
              ) : null}
            </div>
          ) : null
        }
        visual={
          siteConfig.showImages ? (
            <ExperimentVisual
              cover={experiment.cover}
              id={experiment.id}
              title={experiment.title}
              ratio="4 / 3"
              sizes="(min-width: 1760px) 760px, (min-width: 1024px) 42vw, 100vw"
              preload
              zoom={false}
              className="h-full min-h-full"
            />
          ) : undefined
        }
      />

      <dl className="rule-grid">
        {details.map((detail) => (
          <div key={detail.label} className={`cell py-5 ${detailSpan}`}>
            <dt className="label text-fg-muted">{detail.label}</dt>
            <dd className="mt-2">{detail.content}</dd>
          </div>
        ))}
      </dl>

      <div className="rule-grid">
        <div className="cell py-10 lg:col-span-8 lg:py-14">
          {lead ? (
            <div className="prose-lab prose-lab--lead">
              <Mdx source={lead} scope={scope} />
            </div>
          ) : null}

          {sections.map((section, index) => (
            <section
              key={section.slug}
              aria-labelledby={`section-${section.slug}`}
              className={index === 0 && !lead ? '' : 'mt-12 border-t pt-8'}
            >
              <h2 id={`section-${section.slug}`} className="text-title">
                {section.title}
              </h2>
              <div className="prose-lab prose-lab--wide mt-5">
                <Mdx source={section.body} scope={scope} />
              </div>
            </section>
          ))}
        </div>

        <aside aria-label="On this page" className="cell hidden lg:col-span-4 lg:block">
          {sections.length > 2 ? (
            <nav className="sticky top-[calc(var(--header-h)+var(--pad))]">
              <p className="label text-fg-muted">On this page</p>
              <ul className="mt-3 flex flex-col">
                {sections.map((section) => (
                  <li key={section.slug}>
                    <a
                      href={`#section-${section.slug}`}
                      className="inline-flex min-h-8 items-center text-fg-muted hover:text-fg focus-visible:text-fg"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>

      {previous || next ? (
        <>
          <DoubleRule />
          <nav aria-label="More experiments" className="rule-grid">
            {previous ? (
              <div className="cell interactive md:col-span-6">
                <p className="label flex items-center gap-2 text-fg-muted">
                  <ArrowLeft className="nudge" />
                  Previous
                </p>
                <p className="label mt-4 text-fg-muted">
                  {previous.id} · {formatDate(previous.date)}
                </p>
                <Link
                  href={`/experiments/${previous.slug}`}
                  className="stretched mt-2 inline-block text-title"
                >
                  {previous.title}
                </Link>
              </div>
            ) : null}
            {next ? (
              <div
                className={`cell interactive md:col-span-6 ${previous ? '' : 'md:col-start-7'} md:text-right`}
              >
                <p className="label flex items-center gap-2 text-fg-muted md:justify-end">
                  Next
                  <ArrowRight className="nudge" />
                </p>
                <p className="label mt-4 text-fg-muted">
                  {next.id} · {formatDate(next.date)}
                </p>
                <Link
                  href={`/experiments/${next.slug}`}
                  className="stretched mt-2 inline-block text-title"
                >
                  {next.title}
                </Link>
              </div>
            ) : null}
          </nav>
        </>
      ) : null}

      {related ? (
        <section aria-labelledby="related-heading">
          <SectionLabel
            id="related-heading"
            action={{
              href: `/categories/${related.category.slug}`,
              label: `All ${related.category.name}`,
            }}
          >
            More in {related.category.name}
          </SectionLabel>
          <ExperimentIndexHead />
          <ul>
            {related.items.map((item) => (
              <ExperimentRow key={item.slug} experiment={item} titleAs="h3" />
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
