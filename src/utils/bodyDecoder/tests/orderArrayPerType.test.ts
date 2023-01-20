import { describe, expect, it } from 'vitest'

import { orderArrayPerType } from '../bodyDecoder'

describe('orderArrayPerType function', () => {
  it('should return two arrays one with the objects and one with the strings', () => {
    const response = [
      { mimeType: 'pdf', decodedB64: '...', filename: 'file1', contentID: '1' },
      '<p>This is some text</p>',
      { mimeType: 'jpg', decodedB64: '...', filename: 'file2', contentID: '2' },
      '<p>This is some more text</p>',
    ]
    const result = orderArrayPerType(response)
    expect(result).to.deep.equal({
      emailHTML: ['<p>This is some text</p>', '<p>This is some more text</p>'],
      emailFileHTML: [
        {
          mimeType: 'pdf',
          decodedB64: '...',
          filename: 'file1',
          contentID: '1',
        },
        {
          mimeType: 'jpg',
          decodedB64: '...',
          filename: 'file2',
          contentID: '2',
        },
      ],
    })
  })

  it('should return the two empty arrays when the input array is empty', () => {
    const response = []
    const result = orderArrayPerType(response)
    expect(result).to.deep.equal({
      emailHTML: [],
      emailFileHTML: [],
    })
  })

  it('should return the same input array when there is only one type of elements', () => {
    const response = [
      { mimeType: 'pdf', decodedB64: '...', filename: 'file1', contentID: '1' },
      { mimeType: 'jpg', decodedB64: '...', filename: 'file2', contentID: '2' },
    ]
    const result = orderArrayPerType(response)
    expect(result).to.deep.equal({
      emailHTML: [],
      emailFileHTML: [
        {
          mimeType: 'pdf',
          decodedB64: '...',
          filename: 'file1',
          contentID: '1',
        },
        {
          mimeType: 'jpg',
          decodedB64: '...',
          filename: 'file2',
          contentID: '2',
        },
      ],
    })
  })
})
