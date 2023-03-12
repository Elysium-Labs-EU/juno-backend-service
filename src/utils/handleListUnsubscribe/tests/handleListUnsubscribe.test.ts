import { describe, expect, it } from 'vitest'

import handleListUnsubscribe from '../handleListUnsubscribe'

describe('handleListUnsubscribe', () => {
  it('should return a link that is not a mailto link', () => {
    const convertedBody = {
      emailHTML: '...',
      emailFileHTML: [],
      removedTrackers: [],
    }
    const unsubscribeLink1 =
      '<http://example.com/unsubscribe>, <mailto:unsubscribe@example.com>'
    const unsubscribeLink2 =
      '<mailto:unsubscribe@example.com>, <http://example.com/unsubscribe>'
    expect(handleListUnsubscribe(convertedBody, unsubscribeLink1)).toBe(
      'http://example.com/unsubscribe'
    )
    expect(handleListUnsubscribe(convertedBody, unsubscribeLink2)).toBe(
      'http://example.com/unsubscribe'
    )
  })

  it('should return the first link when no non-mailto links are present', () => {
    const convertedBody = {
      emailHTML: '...',
      emailFileHTML: [],
      removedTrackers: [],
    }
    const unsubscribeLink = '<mailto:unsubscribe@example.com>'
    expect(handleListUnsubscribe(convertedBody, unsubscribeLink)).toBe(
      'mailto:unsubscribe@example.com'
    )
  })

  it('should return null when unsubscribeLink is null', () => {
    const convertedBody = {
      emailHTML: '...',
      emailFileHTML: [],
      removedTrackers: [],
    }
    const unsubscribeLink = null
    expect(handleListUnsubscribe(convertedBody, unsubscribeLink)).toBe(null)
  })
})
