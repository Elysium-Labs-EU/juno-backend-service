import { describe, expect, test } from 'vitest'

import messageEncoding from '../messageEncoding'

describe('messageEncoding', () => {
  const message = {
    from: 'sender@example.com',
    body: 'Hello World!',
    subject: 'Test email',
    to: ['recipient@example.com'],
    cc: [''],
    bcc: [''],
    sender: 'sender@example.com',
    signature: '',
    files: undefined,
  }

  test('encodes message correctly', () => {
    const encodedMessage = messageEncoding(message)
    const decodedMessage = Buffer.from(
      encodedMessage.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('ascii')

    expect(decodedMessage).toMatch(/^From: sender@example.com/m)
    expect(decodedMessage).toMatch(/Hello World!/m)
    expect(decodedMessage).toMatch(/^Subject: =\?utf-8\?B\?(.+)\?=$/m)
    expect(decodedMessage).toMatch(/^To: recipient@example.com/m)
  })
})
