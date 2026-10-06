import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/icons'
import { ArchiveList } from '@/components/archive-list'
import { EmptyState } from '@/components/empty-state'
import { ExperimentIndexHead, ExperimentRow } from '@/components/experiment-row'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentTile } from '@/components/experiment-tile'
import { ExperimentVisual } from '@/components/experiment-visual'
import { Mdx } from '@/components/mdx'
import { SectionLabel } from '@/components/section-label'
import { StatStrip } from '@/components/stat-strip'
import { getAboutSource, getCollection } from '@/lib/content'
import { groupArchive } from '@/lib/content/collection'
import { gridSpans } from '@/lib/content/explorer'
import { cn } from '@/lib/cn'
import { LG_COL_SPAN, rowSpans } from '@/lib/layout'
import { pad, plural } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export const metadata = pageMetadata({ description: siteConfig.description, path: '/' })

export default function HomePage() {
  const { experiments, categories, stats } = getCollection()

  const featured = experiments.find((experiment) => experiment.featured)
  // One sequence, newest first, with no gaps. The featured entry stays in it: leaving it out
  // made the IDs read 005, 004, 002, 001 under a separate 003.
  const latest = experiments.slice(0, 5)
  const tiles = latest.slice(0, 2)
  const rows = latest.slice(2)
  const tileSpans = gridSpans(tiles.length)
  const indexPreview = experiments.slice(0, 8)
  const categorySpans = rowSpans(categories.length, 4)
  const archiveTotals = new Map(
    groupArchive(experiments).map((group) => [
      group.year,
      group.months.reduce((total, month) => total + month.entries.length, 0),
    ]),
  )
  const archivePreview = groupArchive(experiments.slice(0, 8)).map((group) => ({
    ...group,
    total: archiveTotals.get(group.year),
  }))
  const aboutIntro = getAboutSource().split(/\n\s*\n/)[0] ?? ''

  return (
    <div className="frame">
      <section aria-labelledby="home-title">
        <StatStrip stats={stats} />
        <div className="rule-grid">
          <div className="cell pt-4 pb-10 md:pb-16 lg:col-span-8">
            <p className="label text-fg-muted">{siteConfig.kicker}</p>
            <h1 id="home-title" className="mt-8 text-display text-balance md:mt-14">
              {siteConfig.name}
            </h1>
          </div>
          <div className="cell flex flex-col justify-between gap-10 pt-4 pb-6 lg:col-span-4">
            <p className="max-w-[34ch] text-lead">{siteConfig.tagline}</p>
            <div className="flex flex-col items-start">
              <Link
                href="/experiments?view=index"
                className="label group inline-flex min-h-11 items-center gap-2 text-accent underline underline-offset-4"
              >
                Browse the index
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]" />
              </Link>
              <Link
                href="/about"
                className="label group inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg focus-visible:text-fg"
              >
                About
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {experiments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {featured ? (
            <section aria-labelledby="featured-heading">
              <SectionLabel id="featured-heading">Featured experiment</SectionLabel>
              <article className="interactive">
                <div className="rule-grid">
                  <div
                    className={cn(
                      'cell order-2 flex flex-col justify-between gap-12 py-8 md:py-10 lg:order-1',
                      siteConfig.showImages ? 'lg:col-span-5' : 'lg:col-span-12',
                    )}
                  >
                    <div className="flex flex-col gap-6">
                      <ExperimentMeta experiment={featured} />
                      <h3 className="text-headline">
                        <Link href={`/experiments/${featured.slug}`} className="stretched">
                          {featured.title}
                        </Link>
                      </h3>
                      <p className="max-w-[42ch] text-lead text-fg-muted">{featured.description}</p>
                    </div>
                    <div className="flex flex-col gap-5">
                      {featured.tags.length > 0 ? (
                        <ul className="label flex flex-wrap gap-x-4 gap-y-1 text-fg-muted">
                          {featured.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      ) : null}
                      <span className="label inline-flex items-center gap-2 text-accent">
                        View experiment
                        <ArrowUpRight className="nudge-ne text-base" />
                      </span>
                    </div>
                  </div>
                  {siteConfig.showImages ? (
                    <div className="cell order-1 p-0 lg:order-2 lg:col-span-7">
                      <ExperimentVisual
                        cover={featured.cover}
                        id={featured.id}
                        title={featured.title}
                        ratio="16 / 10"
                        sizes="(min-width: 1760px) 1000px, (min-width: 1024px) 58vw, 100vw"
                        preload
                        className="h-full min-h-full"
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            </section>
          ) : null}

          {latest.length > 0 ? (
            <section aria-labelledby="latest-heading">
              <SectionLabel
                id="latest-heading"
                action={{ href: '/experiments', label: 'View all' }}
              >
                Latest experiments
              </SectionLabel>
              <ul className="rule-grid tiles">
                {tiles.map((experiment, index) => (
                  <ExperimentTile
                    key={experiment.slug}
                    experiment={experiment}
                    span={tileSpans[index]}
                    headingLevel={3}
                  />
                ))}
              </ul>
              {rows.length > 0 ? (
                <ul>
                  {rows.map((experiment) => (
                    <ExperimentRow
                      key={experiment.slug}
                      experiment={experiment}
                      variant="media"
                      titleAs="h3"
                    />
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          <section aria-labelledby="index-heading">
            <SectionLabel
              id="index-heading"
              action={{ href: '/experiments?view=index', label: 'Browse all' }}
            >
              Index
            </SectionLabel>
            <ExperimentIndexHead />
            <ul>
              {indexPreview.map((experiment) => (
                <ExperimentRow key={experiment.slug} experiment={experiment} titleAs="h3" />
              ))}
            </ul>
          </section>

          <section aria-labelledby="categories-heading">
            <SectionLabel
              id="categories-heading"
              action={{ href: '/categories', label: 'All categories' }}
            >
              Categories
            </SectionLabel>
            <ul className="rule-grid tiles">
              {categories.map((category, index) => (
                <li
                  key={category.slug}
                  className={`cell interactive flex flex-col gap-8 md:col-span-6 ${LG_COL_SPAN[categorySpans[index] ?? 4]}`}
                >
                  <h3 className="text-title">
                    <Link href={`/categories/${category.slug}`} className="stretched">
                      {category.name}
                    </Link>
                  </h3>
                  <p className="label mt-auto flex flex-col gap-1.5 text-fg-muted">
                    <span className="text-fg">
                      {pad(category.count)} {plural(category.count, 'Experiment')}
                    </span>
                    <span>
                      Latest: {category.latest.id} {category.latest.title}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="archive-heading">
            <SectionLabel id="archive-heading" action={{ href: '/archive', label: 'Full archive' }}>
              Archive
            </SectionLabel>
            <ArchiveList years={archivePreview} yearAs="h3" monthAs="h4" />
          </section>
        </>
      )}

      <section aria-labelledby="about-heading">
        <SectionLabel id="about-heading" action={{ href: '/about', label: 'About' }}>
          About
        </SectionLabel>
        <div className="rule-grid">
          <div className="cell py-12 md:py-20 lg:col-span-9">
            <div className="prose-about">
              <Mdx source={aboutIntro} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
