/** Label for an entry's demoUrl, based on where it points. */
export function demoLabel(url: string): string {
  let host = ''
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Live demo'
  }
  if (host === 'chromewebstore.google.com' || host === 'chrome.google.com')
    return 'Chrome Web Store'
  if (host === 'apps.apple.com') return 'App Store'
  if (host === 'testflight.apple.com') return 'TestFlight'
  if (host === 'play.google.com') return 'Google Play'
  return 'Live demo'
}
