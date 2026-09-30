import type { ExperimentStatus } from '@/lib/content/types'
import type { Theme } from '@/lib/theme/theme'
import { cn } from '@/lib/cn'

/**
 * Inline SVG instead of font glyphs: arrows and status symbols are not in the Latin font
 * subsets, and a fallback font would make them look different on every device.
 */
interface IconProps {
  className?: string
}

const svgProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  'aria-hidden': true,
  focusable: false,
} as const

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...svgProps} className={cn('shrink-0', className)}>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg {...svgProps} className={cn('shrink-0', className)}>
      <path d="M14 8H3M7 4 3 8l4 4" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...svgProps} className={cn('shrink-0', className)}>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  )
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg {...svgProps} className={cn('shrink-0', className)}>
      <path d="M8 14V3M4 7l4-4 4 4" />
    </svg>
  )
}

/** ● live, ◐ building, ○ archived. The shape carries the meaning; colour only reinforces it. */
export function StatusGlyph({ status, className }: IconProps & { status: ExperimentStatus }) {
  return (
    <svg {...svgProps} width="0.8em" height="0.8em" className={cn('shrink-0', className)}>
      {status === 'live' ? (
        <circle cx="8" cy="8" r="4.5" fill="currentColor" stroke="none" />
      ) : (
        <circle cx="8" cy="8" r="4" />
      )}
      {status === 'building' ? (
        <path d="M8 4a4 4 0 0 1 0 8z" fill="currentColor" stroke="none" />
      ) : null}
    </svg>
  )
}

/** ◐ for dark, ○ for light. */
export function ThemeGlyph({ theme, className }: IconProps & { theme: Theme }) {
  return (
    <svg {...svgProps} width="0.9em" height="0.9em" className={cn('shrink-0', className)}>
      <circle cx="8" cy="8" r="5.5" />
      {theme === 'dark' ? (
        <path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" stroke="none" />
      ) : null}
    </svg>
  )
}
