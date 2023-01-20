import { describe, expect, it } from 'vitest'

import { loopThroughParts } from '../fetchAttachments'

describe('loopThroughParts', () => {
  it('should find attachments correctly', () => {
    const input = [
      {
        parts: [
          {
            filename: 'attachment1.pdf',
            headers: [{ name: 'Content-Disposition', value: 'attachment' }],
          },
          {
            parts: [
              {
                filename: 'attachment2.pdf',
                headers: [{ name: 'Content-Disposition', value: 'attachment' }],
              },
            ],
          },
        ],
      },
    ]
    const attachments = loopThroughParts({ input })
    expect(attachments).toEqual([
      {
        filename: 'attachment1.pdf',
        headers: [{ name: 'Content-Disposition', value: 'attachment' }],
      },
      {
        filename: 'attachment2.pdf',
        headers: [{ name: 'Content-Disposition', value: 'attachment' }],
      },
    ])
  })

  it('should return an empty array when input is undefined', () => {
    expect(loopThroughParts({ input: undefined })).toEqual([])
  })
})
