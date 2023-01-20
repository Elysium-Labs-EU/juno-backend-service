import { describe, expect, it } from 'vitest'

import { prioritizeHTMLbodyObject } from '../bodyDecoder'

describe('prioritizeHTMLbodyObject', () => {
  it('returns the single string object if the response only has one', () => {
    const response = {
      emailHTML: ['<html>Test</html>'],
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    }
    const result = prioritizeHTMLbodyObject(response)
    expect(result).toEqual({
      emailHTML: '<html>Test</html>',
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    })
  })

  it('returns the html rich string if it exists', () => {
    const response = {
      emailHTML: ['Test', '<html>Test</html>'],
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    }
    const result = prioritizeHTMLbodyObject(response)
    expect(result).toEqual({
      emailHTML: '<html>Test</html>',
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    })
  })

  it('returns the last non-html string if no html rich string exists', () => {
    const response = {
      emailHTML: ['Test', 'Test2'],
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    }
    const result = prioritizeHTMLbodyObject(response)
    expect(result).toEqual({
      emailHTML: 'Test2',
      emailFileHTML: [
        {
          mimeType: 'text/html',
          decodedB64: '',
          filename: '',
          contentID: '',
        },
      ],
    })
  })
})
