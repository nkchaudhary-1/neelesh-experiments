import { getCollection } from '@/lib/content'
import { pad } from '@/lib/format'
import { renderOgCard } from '@/lib/og/card'
import { siteConfig } from '@/lib/site-config'

/** Site-wide share image, used wherever a page has no image of its own. */
export const dynamic = 'force-static'

export async function GET() {
  const { stats } = getCollection()
  return renderOgCard({
    eyebrow: siteConfig.kicker,
    title: siteConfig.name,
    footerLeft: 'A public archive',
    footerRight: `${pad(stats.total)} experiments · ${pad(stats.live)} live`,
  })
}
