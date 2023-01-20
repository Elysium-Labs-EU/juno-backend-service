import { describe, expect, it } from 'vitest'

import removeTrackers from '../removeTrackers'

describe('removeTrackers', () => {
  it('removes trackers from emailHTML', () => {
    const emailHTML =
      '<img src="http://mailstat.us/tracker.gif" width="1" height="1" style="display: none !important;">'
    const emailFileHTML = []
    const orderedObject = { emailHTML, emailFileHTML }
    const result = removeTrackers(orderedObject)
    expect(result.emailHTML).not.toContain('http://mailstat.us/tracker.gif')
    expect(result.removedTrackers.length).toBeGreaterThan(0)
  })
})
