import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { pad, plural } from '@/lib/format'
import type { CategorySummary } from '@/lib/content/types'

/** One ruled line per category: name, description, count and the latest piece of work. */
export function CategoryDirectory({ categories }: { categories: CategorySummary[] }) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug} className="interactive border-b">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3fr)_5rem]">
            <h2 className="p-[var(--pad)] pb-2 text-section uppercase lg:pb-[var(--pad)]">
              <Link href={`/categories/${category.slug}`} className="stretched">
                {category.name}
              </Link>
            </h2>
            <p className="px-[var(--pad)] pb-4 text-fg-muted lg:border-l lg:p-[var(--pad)]">
              {category.description}
            </p>
            <div className="label flex flex-col gap-1.5 px-[var(--pad)] pb-[var(--pad)] text-fg-muted lg:border-l lg:p-[var(--pad)]">
              <span className="text-fg">
                {pad(category.count)} {plural(category.count, 'Experiment')}
              </span>
              <span>
                Latest: {category.latest.id} {category.latest.title}
              </span>
            </div>
            <div className="label hidden items-center justify-center border-l text-fg-muted lg:flex">
              <ArrowRight className="nudge text-base" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
