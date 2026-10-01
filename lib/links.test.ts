import { describe, expect, it } from 'vitest'
import { demoLabel } from '@/lib/links'

describe('demoLabel', () => {
  it.each([
    [
      'https://chromewebstore.google.com/detail/inspira/ohdnckjldimefbkmmpjmmcahiiapemff',
      'Chrome Web Store',
    ],
    ['https://chrome.google.com/webstore/detail/x/abc', 'Chrome Web Store'],
    ['https://apps.apple.com/app/id1', 'App Store'],
    ['https://testflight.apple.com/join/abc', 'TestFlight'],
    ['https://play.google.com/store/apps/details?id=x', 'Google Play'],
    ['https://example.com/demo', 'Live demo'],
    ['not a url', 'Live demo'],
  ])('%s → %s', (url, label) => {
    expect(demoLabel(url)).toBe(label)
  })
})
