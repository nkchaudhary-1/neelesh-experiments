import { evaluate } from '@mdx-js/mdx'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { describe, expect, it } from 'vitest'
import { remarkFigures } from '@/lib/content/remark-figures'

async function render(source: string): Promise<string> {
  const { default: Content } = await evaluate(source, {
    ...(runtime as unknown as Parameters<typeof evaluate>[1]),
    remarkPlugins: [remarkFigures],
  })
  // React 19 hoists a preload <link> for plain <img> tags; it is not part of the structure under test.
  return renderToStaticMarkup(createElement(Content))
    .replace(/<link[^>]*\/>/g, '')
    .replace(/>\s*\n\s*</g, '><')
}

describe('figures and captions', () => {
  it('wraps an image and its *Caption:* paragraph in a figure', async () => {
    const html = await render(
      '![A split layout](./detail-01.png)\n\n*Caption: The layout keeps sources visible.*\n\nNext paragraph.',
    )
    expect(html).toBe(
      '<figure><img src="./detail-01.png" alt="A split layout"/><figcaption>The layout keeps sources visible.</figcaption></figure><p>Next paragraph.</p>',
    )
  })

  it('accepts a caption on the line directly below the image', async () => {
    const html = await render('![Alt](./a.png)\n*Caption: Tight.*')
    expect(html).toBe(
      '<figure><img src="./a.png" alt="Alt"/><figcaption>Tight.</figcaption></figure>',
    )
  })

  it('makes a captionless image a figure too, never an image inside a paragraph', async () => {
    const html = await render('![Alt](./a.png)')
    expect(html).toBe('<figure><img src="./a.png" alt="Alt"/></figure>')
  })

  it('keeps inline formatting inside captions', async () => {
    const html = await render('![Alt](./a.png)\n\n*Caption: Uses `ease-out` at **160ms**.*')
    expect(html).toContain(
      '<figcaption>Uses <code>ease-out</code> at <strong>160ms</strong>.</figcaption>',
    )
  })

  it('leaves other emphasis and inline images alone', async () => {
    expect(await render('![Alt](./a.png)\n\n*Not a caption.*')).toBe(
      '<figure><img src="./a.png" alt="Alt"/></figure><p><em>Not a caption.</em></p>',
    )
    expect(await render('Text with ![icon](./i.png) inline.')).toBe(
      '<p>Text with <img src="./i.png" alt="icon"/> inline.</p>',
    )
  })
})
