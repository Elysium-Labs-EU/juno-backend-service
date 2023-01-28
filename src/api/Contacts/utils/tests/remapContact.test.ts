import { describe, expect, it } from 'vitest'

import type { TPeopleV1SchemaSearchResponseSchema } from '../../../../types/peopleTypes'
import remapContacts from '../remapContacts'

describe('remapContacts', () => {
  it('should return an array of remapped contact objects', () => {
    const input: TPeopleV1SchemaSearchResponseSchema = {
      results: [
        {
          person: {
            names: [{ displayName: 'John Doe' }],
            emailAddresses: [{ value: 'johndoe@gmail.com' }],
          },
        },
        {
          person: {
            emailAddresses: [{ value: 'janedoe@gmail.com' }],
          },
        },
      ],
    }

    const expectedOutput = [
      { name: 'John Doe', emailAddress: 'johndoe@gmail.com' },
      { name: 'janedoe@gmail.com', emailAddress: 'janedoe@gmail.com' },
    ]

    expect(remapContacts(input)).toEqual(expectedOutput)
  })

  it('should return an empty array when the input does not have a results property or the results array is empty', () => {
    const input: TPeopleV1SchemaSearchResponseSchema = {}
    expect(remapContacts(input)).toEqual([])
  })
})
