import { HeroBanner } from '@/components/hero-banner'

/** The banner for the directory pages: a count, the page title and one line on what it shows. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  intro?: string
}) {
  return <HeroBanner kicker={eyebrow} title={title} intro={intro ? <p>{intro}</p> : undefined} />
}
