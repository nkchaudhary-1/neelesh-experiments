import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from '@/components/icons'
import { ExperimentIndexHead, ExperimentRow } from '@/components/experiment-row'
import { PageHeader, Slash } from '@/components/page-header'
import { getCollection } from '@/lib/content'
import { pad, plural } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getCollection().categories.map((category) => ({ category: category.slug }))
}

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCollection().categories.find((candidate) => candidate.slug === slug)
  if (!category) return {}
  return pageMetadata({
    title: `${category.name} experiments`,
    description: category.description,
    path: `/categories/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const { categories, experiments } = getCollection()
  const category = categories.find((candidate) => candidate.slug === slug)
  if (!category) notFound()

  const members = experiments.filter((experiment) =>
    experiment.categories.some((candidate) => candidate.slug === category.slug),
  )
  const others = categories.filter((candidate) => candidate.slug !== category.slug)

  return (
    <div className="frame">
      <div className="rule-grid">
        <div className="cell py-3">
          <Link
            href="/categories"
            className="label group inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg focus-visible:text-fg md:min-h-0"
          >
            <ArrowLeft className="transition-transform duration-150 group-hover:-translate-x-[3px] group-focus-visible:-translate-x-[3px]" />
            All categories
          </Link>
        </div>
      </div>

      <PageHeader
        eyebrow={`${pad(category.count)} ${plural(category.count, 'Experiment')}`}
        title={
          <>
            <Slash />
            {category.name}
          </>
        }
        aside={<p className="max-w-[38ch] text-fg-muted">{category.description}</p>}
      />

      <section aria-label={`${category.name} experiments`}>
        <ExperimentIndexHead />
        <ul>
          {members.map((experiment) => (
            <ExperimentRow key={experiment.slug} experiment={experiment} titleAs="h2" />
          ))}
        </ul>
      </section>

      {others.length > 0 ? (
        <nav aria-label="Other categories" className="rule-grid">
          <div className="cell flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
            <span className="label text-fg-muted">Other categories</span>
            <ul className="flex flex-wrap gap-x-5">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/categories/${other.slug}`}
                    className="label inline-flex min-h-11 min-w-11 items-center text-fg hover:text-accent focus-visible:text-accent md:min-h-9"
                  >
                    {other.name} <span className="ml-1.5 text-fg-muted">{pad(other.count)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </div>
  )
}
