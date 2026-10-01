/** Title block shared by the directory pages: mono eyebrow, large h1, optional aside. */
import { DoubleRule } from '@/components/double-rule'

export function PageHeader({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <>
      <header className="rule-grid">
        <div className={aside ? 'cell lg:col-span-8' : 'cell'}>
          {eyebrow ? <p className="label text-fg-muted">{eyebrow}</p> : null}
          <h1 className="mt-8 text-headline md:mt-14">{title}</h1>
        </div>
        {aside ? (
          <div className="cell flex flex-col justify-end gap-4 lg:col-span-4">{aside}</div>
        ) : null}
      </header>
      <DoubleRule />
    </>
  )
}

/** The "/" that prefixes page labels. Decorative, so it is hidden from screen readers. */
export function Slash() {
  return (
    <span aria-hidden className="text-fg-faint">
      /{' '}
    </span>
  )
}
