import { describe, expect, it } from 'vitest'

import { placeInlineImage } from '../bodyDecoder'

describe('placeInlineImage', () => {
  it('replaces the matching `src` attribute with the corresponding attachment data', () => {
    const emailFileHTML = [
      {
        mimeType: 'image/png',
        decodedB64: 'abcdefg',
        filename: 'image.png',
        contentID: 'image1',
      },
    ]
    const emailHTML = '<img src="cid:image1"/>'
    const orderedObject = { emailHTML, emailFileHTML }
    const expectedResult =
      '<html><head></head><body><img src="data:image/png;base64,abcdefg"></body></html>'
    const result = placeInlineImage(orderedObject)
    expect(result).toEqual({ emailHTML: expectedResult, emailFileHTML: [] })
  })
  it('returns the original object if no attachments are present', () => {
    const emailHTML = '<img src="cid:image1"/>'
    const orderedObject = { emailHTML, emailFileHTML: [] }
    const result = placeInlineImage(orderedObject)
    expect(result).toEqual(orderedObject)
  })
  it('filters out attachments that cannot be displayed in html', () => {
    const emailFileHTML = [
      {
        mimeType: 'image/png',
        decodedB64: 'abcdefg',
        filename: 'image.png',
        contentID: 'image1',
      },
      {
        mimeType: 'application/pdf',
        decodedB64: 'abcdefg',
        filename: 'file.pdf',
        contentID: 'file1',
      },
    ]
    const emailHTML = '<img src="cid:image1"/>'
    const orderedObject = { emailHTML, emailFileHTML }
    const expectedResult =
      '<html><head></head><body><img src="data:image/png;base64,abcdefg"></body></html>'
    const result = placeInlineImage(orderedObject)
    expect(result).toEqual({
      emailHTML: expectedResult,
      emailFileHTML: [
        {
          mimeType: 'application/pdf',
          decodedB64: 'abcdefg',
          filename: 'file.pdf',
          contentID: 'file1',
        },
      ],
    })
  })
})
