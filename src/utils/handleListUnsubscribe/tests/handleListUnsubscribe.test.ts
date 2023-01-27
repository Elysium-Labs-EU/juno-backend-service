import { describe, expect, it } from 'vitest'

import handleListUnsubscribe from '../handleListUnsubscribe'

describe('handleListUnsubscribe', () => {
  it('should return a link that is not a mailto link', () => {
    expect(
      handleListUnsubscribe(
        '<http://example.com/unsubscribe>, <mailto:unsubscribe@example.com>'
      )
    ).toBe('http://example.com/unsubscribe')
    expect(
      handleListUnsubscribe(
        '<mailto:unsubscribe@example.com>, <http://example.com/unsubscribe>'
      )
    ).toBe('http://example.com/unsubscribe')
  })

  it('should return the first link when no non-mailto links are present', () => {
    expect(handleListUnsubscribe('<mailto:unsubscribe@example.com>')).toBe(
      'mailto:unsubscribe@example.com'
    )
  })

  it('should return null when unsubscribeLink is null', () => {
    expect(handleListUnsubscribe(null)).toBe(null)
  })
})
