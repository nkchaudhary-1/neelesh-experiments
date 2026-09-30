import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { ExperimentStatus } from '@/lib/content/types'

const WIDTH = 1200
const HEIGHT = 630

const COLORS = {
  bg: '#090909',
  fg: '#f2f1ed',
  muted: '#8a8985',
  rule: 'rgba(255,255,255,0.13)',
  grid: 'rgba(255,255,255,0.06)',
  accent: '#c7f36b',
}

async function font(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), 'lib/og/fonts', file))
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer
}

function titleSize(title: string): number {
  if (title.length <= 12) return 168
  if (title.length <= 20) return 132
  if (title.length <= 32) return 104
  return 80
}

function Dot({ status }: { status: ExperimentStatus }) {
  const color = status === 'live' ? COLORS.accent : COLORS.fg
  // satori rejects undefined style values, so only set a fill when there is one.
  const fill =
    status === 'live'
      ? { backgroundImage: `linear-gradient(${color}, ${color})` }
      : status === 'building'
        ? { backgroundImage: `linear-gradient(90deg, ${color} 50%, transparent 50%)` }
        : {}
  return (
    <div
      style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${color}`, ...fill }}
    />
  )
}

export interface OgCardInput {
  eyebrow: string
  title: string
  /** Right-hand label in the top bar, such as the experiment ID. */
  badge?: string
  status?: ExperimentStatus
  footerLeft: string
  footerRight?: string
}

/** Type-led share card: the archive's grid, one big title, metadata along the bottom. */
export async function renderOgCard(input: OgCardInput): Promise<ImageResponse> {
  const [sans500, sans700, mono500] = await Promise.all([
    font('InterTight-500.woff'),
    font('InterTight-700.woff'),
    font('GeistMono-500.woff'),
  ])

  const mono = {
    fontFamily: 'Geist Mono',
    fontSize: 24,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.bg,
        color: COLORS.fg,
        position: 'relative',
      }}
    >
      {Array.from({ length: 11 }, (_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: (index + 1) * 100,
            width: 1,
            backgroundColor: COLORS.grid,
          }}
        />
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 84,
          padding: '0 48px',
          borderBottom: `1px solid ${COLORS.rule}`,
          ...mono,
        }}
      >
        <div style={{ display: 'flex' }}>{input.eyebrow}</div>
        {input.badge ? (
          <div style={{ display: 'flex', color: COLORS.muted }}>{input.badge}</div>
        ) : null}
      </div>

      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', padding: '0 48px 40px' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Inter Tight',
            fontWeight: 700,
            fontSize: titleSize(input.title),
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
            textTransform: 'uppercase',
            maxHeight: 340,
            overflow: 'hidden',
          }}
        >
          {input.title}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 96,
          padding: '0 48px',
          borderTop: `1px solid ${COLORS.rule}`,
          ...mono,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {input.status ? <Dot status={input.status} /> : null}
          <div
            style={{ display: 'flex', color: input.status === 'live' ? COLORS.accent : COLORS.fg }}
          >
            {input.footerLeft}
          </div>
        </div>
        {input.footerRight ? (
          <div style={{ display: 'flex', color: COLORS.muted }}>{input.footerRight}</div>
        ) : null}
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Inter Tight', data: sans500, weight: 500, style: 'normal' },
        { name: 'Inter Tight', data: sans700, weight: 700, style: 'normal' },
        { name: 'Geist Mono', data: mono500, weight: 500, style: 'normal' },
      ],
    },
  )
}
