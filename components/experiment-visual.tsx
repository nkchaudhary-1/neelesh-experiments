import Image from 'next/image'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/lib/site-config'
import type { MediaAsset } from '@/lib/content/types'

/**
 * Responsive media wrapper. The aspect ratio is fixed on the wrapper so the page never
 * shifts while the image loads. Without a cover it falls back to a type-led plate.
 */
export function ExperimentVisual({
  cover,
  id,
  title,
  sizes,
  ratio = '16 / 10',
  preload = false,
  zoom = true,
  className,
}: {
  cover?: MediaAsset
  id: string
  title: string
  sizes: string
  ratio?: string
  /** Only for the single most important image on a page. */
  preload?: boolean
  zoom?: boolean
  className?: string
}) {
  // With images off the area is removed, not replaced by an empty plate.
  if (!siteConfig.showImages) return null

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-surface', className)}
      style={{ aspectRatio: ratio }}
    >
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cn('object-cover', zoom && 'zoom')}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-between bg-surface-raised p-4 text-fg-faint"
        >
          <span className="label">{title}</span>
          <span className="font-mono text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-tighter">
            {id}
          </span>
        </div>
      )}
    </div>
  )
}
