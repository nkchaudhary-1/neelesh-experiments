import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from '@/components/icons'
import { ExperimentIndexHead, ExperimentRow } from '@/components/experiment-row'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentVisual } from '@/components/experiment-visual'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { SectionLabel } from '@/components/section-label'
import { StatusBadge } from '@/components/status-badge'
import { getCollection, getExperiment } from '@/lib/content'
import { getAdjacent, getMoreInCategory } from '@/lib/content/collection'
import { splitSections, stripFigures } from '@/lib/content/parse'
import { formatDate } from '@/lib/format'
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

  // Frontmatter stack is shown as metadata, so a "## Stack" section would only repeat it.
  const sections = authored.filter(
    (section) => !(section.slug === 'stack' && experiment.stack.length > 0),
  )
  const scope = { slug: experiment.slug, folder: experiment.folder }

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
            Experiment index
          </Link>
        </div>
      </div>

      <header>
        <div className="rule-grid">
          <div className="cell pt-8 pb-10 md:pt-14 md:pb-14 lg:col-span-9">
            <p className="label flex flex-wrap items-center gap-x-4 gap-y-1 text-fg-muted">
              <span className="text-fg">{experiment.id}</span>
              <time dateTime={experiment.date}>{formatDate(experiment.date)}</time>
              <StatusBadge status={experiment.status} />
              {experiment.draft ? <span className="text-accent">Draft</span> : null}
            </p>
            <h1 className="mt-8 text-headline md:mt-14">{experiment.title}</h1>
          </div>
          <div className="cell hidden items-end justify-end lg:col-span-3 lg:flex">
            <span aria-hidden className="font-mono text-display leading-none text-fg-faint">
              {experiment.id}
            </span>
          </div>
        </div>
        <div className="rule-grid">
          <div className="cell lg:col-span-7">
            <p className="max-w-[40ch] text-lead">{experiment.description}</p>
          </div>
          <div className="cell lg:col-span-5">
            <ExperimentMeta experiment={experiment} variant="list" />
          </div>
        </div>
        {siteConfig.showImages ? (
          <div className="rule-grid">
            <div className="cell p-0">
              <ExperimentVisual
                cover={experiment.cover}
                id={experiment.id}
                title={experiment.title}
                ratio="16 / 9"
                sizes="(min-width: 1760px) 1760px, 100vw"
                preload
                zoom={false}
              />
            </div>
          </div>
        ) : null}
      </header>

      {lead ? (
        <div className="rule-grid">
          <div className="cell lg:col-span-3">
            <p className="label text-fg-muted lg:sticky lg:top-[calc(var(--header-h)+var(--pad))]">
              <span aria-hidden>/ </span>Summary
            </p>
          </div>
          <div className="cell py-10 lg:col-span-9 lg:py-14">
            <div className="prose-lab prose-lab--lead">
              <Mdx source={lead} scope={scope} />
            </div>
          </div>
        </div>
      ) : null}

      {sections.map((section) => (
        <section
          key={section.slug}
          aria-labelledby={`section-${section.slug}`}
          className="rule-grid"
        >
          <div className="cell lg:col-span-3">
            <h2
              id={`section-${section.slug}`}
              className="label text-fg-muted lg:sticky lg:top-[calc(var(--header-h)+var(--pad))]"
            >
              <span aria-hidden>/ </span>
              {section.title}
            </h2>
          </div>
          <div className="cell py-8 lg:col-span-9 lg:py-12">
            <div className="prose-lab prose-lab--wide">
              <Mdx source={section.body} scope={scope} />
            </div>
          </div>
        </section>
      ))}

      {previous || next ? (
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
