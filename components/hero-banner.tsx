import { DoubleRule } from '@/components/double-rule'
import { VisualSlot } from '@/components/visual-slot'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/lib/site-config'

/**
 * The one banner at the top of every page: a small label, the page title, one or two lines that
 * say what the page is, optional links, and a single visual. Everything below it is content.
 *
 * `visual` left undefined shows the placeholder while `siteConfig.showPlaceholders` is on, and no
 * visual when it is off. Pass `null` to force a text-only banner.
 */
export function HeroBanner({
  kicker,
  title,
  titleId,
  intro,
  meta,
  actions,
  visual,
  size = 'page',
}: {
  kicker?: React.ReactNode
  title: React.ReactNode
  titleId?: string
  /** One or two short paragraphs. */
  intro?: React.ReactNode
  /** A quiet line of facts under the intro. */
  meta?: React.ReactNode
  actions?: React.ReactNode
  visual?: React.ReactNode
  size?: 'home' | 'page'
}) {
  const slot = visual === undefined ? siteConfig.showPlaceholders ? <VisualSlot /> : null : visual

  return (
    <>
      <header className="rule-grid">
        <div
          className={cn(
            'cell flex flex-col justify-between gap-10 pt-4 pb-8 md:pb-12',
            slot ? 'lg:col-span-7' : null,
          )}
        >
          <div>
            {kicker ? <div className="label text-fg-muted">{kicker}</div> : null}
            <h1
              id={titleId}
              className={cn('mt-6 md:mt-10', size === 'home' ? 'text-display' : 'text-headline')}
            >
              {title}
            </h1>
            {intro ? <div className="mt-6 max-w-[46ch] space-y-3 text-lead">{intro}</div> : null}
          </div>
          {meta || actions ? (
            <div className="flex flex-col items-start gap-5">
              {meta}
              {actions}
            </div>
          ) : null}
        </div>
        {slot ? <div className="cell p-0 lg:col-span-5">{slot}</div> : null}
      </header>
      <DoubleRule />
    </>
  )
}
