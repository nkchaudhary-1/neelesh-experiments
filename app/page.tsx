import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/icons'
import { EmptyState } from '@/components/empty-state'
import { ExperimentRow } from '@/components/experiment-row'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentVisual } from '@/components/experiment-visual'
import { HeroBanner } from '@/components/hero-banner'
import { Mdx } from '@/components/mdx'
import { SectionLabel } from '@/components/section-label'
import { getAboutSource, getCollection } from '@/lib/content'
import { cn } from '@/lib/cn'
import { pad } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export const metadata = pageMetadata({ description: siteConfig.description, path: '/' })

const arrow =
  'transition-transform duration-150 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]'

export default function HomePage() {
  const { experiments, categories, stats } = getCollection()

  const featured = experiments.find((experiment) => experiment.featured)
  // One list, newest first, with no gaps. The featured entry stays in it.
  const latest = experiments.slice(0, 5)
  const aboutIntro = getAboutSource().split(/\n\s*\n/)[0] ?? ''

  return (
    <div className="frame">
      <HeroBanner
        size="home"
        titleId="home-title"
        kicker={siteConfig.kicker}
        title={siteConfig.name}
        intro={
          <>
            <p>{siteConfig.tagline}</p>
            <p className="text-base text-fg-muted">{siteConfig.method}</p>
          </>
        }
        meta={
          <p className="label text-fg-muted">
            {pad(stats.total)} experiments · {pad(stats.live)} live · {pad(stats.building)} building
            <br />
            Exploring: {siteConfig.exploring.join(', ')}
          </p>
        }
        actions={
          <div className="flex flex-wrap items-center gap-x-8">
            <Link
              href="/experiments"
              className="label group inline-flex min-h-11 items-center gap-2 text-accent underline underline-offset-4"
            >
              Browse all experiments
              <ArrowRight className={arrow} />
            </Link>
            <Link
              href="/about"
              className="label group inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg focus-visible:text-fg"
            >
              About
              <ArrowRight className={arrow} />
            </Link>
          </div>
        }
      />

      {experiments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {featured ? (
            <section aria-labelledby="featured-heading">
              <SectionLabel id="featured-heading" rule={false}>
                Featured
              </SectionLabel>
              <article className="interactive">
                <div className="rule-grid">
                  <div
                    className={cn(
                      'cell order-2 flex flex-col justify-between gap-10 py-8 md:py-10 lg:order-1',
                      siteConfig.showImages ? 'lg:col-span-5' : 'lg:col-span-12',
                    )}
                  >
                    <div className="flex flex-col gap-5">
                      <ExperimentMeta experiment={featured} />
                      <h3 className="text-headline">
                        <Link href={`/experiments/${featured.slug}`} className="stretched">
                          {featured.title}
                        </Link>
                      </h3>
                      <p className="max-w-[46ch] text-lead text-fg-muted">{featured.description}</p>
                    </div>
                    <span className="label inline-flex items-center gap-2 text-accent">
                      Read the entry
                      <ArrowUpRight className="nudge-ne text-base" />
                    </span>
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

          <section aria-labelledby="latest-heading">
            <SectionLabel
              id="latest-heading"
              action={{ href: '/experiments', label: 'All experiments' }}
            >
              Latest
            </SectionLabel>
            <ul>
              {latest.map((experiment) => (
                <ExperimentRow
                  key={experiment.slug}
                  experiment={experiment}
                  variant="media"
                  titleAs="h3"
                />
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
            <div className="rule-grid">
              <div className="cell py-6">
                <ul className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="label inline-flex min-h-11 items-center gap-3 rounded-full border border-border-strong px-4 hover:bg-surface focus-visible:bg-surface"
                      >
                        {category.name}
                        <span className="text-fg-muted">{pad(category.count)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="about-heading">
        <SectionLabel id="about-heading" action={{ href: '/about', label: 'More about me' }}>
          About
        </SectionLabel>
        <div className="rule-grid">
          <div className="cell py-10 md:py-14 lg:col-span-9">
            <div className="prose-about">
              <Mdx source={aboutIntro} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
