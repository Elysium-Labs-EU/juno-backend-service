import fs from 'fs'

import type { IMessageEncoding } from './messageEncodingTypes'

const messageEncoding = ({
  from,
  body,
  subject,
  to,
  cc,
  bcc,
  signature,
  files,
}: IMessageEncoding): string => {
  const nl = '\n'
  const boundary = '__juno__'

  const utf8Subject = subject
    ? `=?utf-8?B?${Buffer.from(subject[0] ?? '').toString('base64')}?=`
    : ''

  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,

    'Content-Type: multipart/alternative; boundary=' + boundary + nl,
    '--' + boundary,

    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64' + nl,
    `${body}` + nl,

    '',
    `${signature && signature.length > 0 && signature}`,
  ]

  // Handle filesArray coming via the api request here.
  if (files && 'file' in files && files.file.length > 0) {
    for (const file of files.file) {
      const content = fs.readFileSync(file.filepath)
      const toBase64 = Buffer.from(content).toString('base64')

      const attachment = [
        `--${boundary}`,
        `Content-Type: ${file.mimetype}; name="${file.originalFilename}"`,
        `Content-Disposition: attachment; filename="${file.originalFilename}"`,
        `Content-Transfer-Encoding: base64${nl}`,
        toBase64,
      ]
      messageParts.push(attachment.join(nl))
    }
  }
  messageParts.push('--' + boundary + '--')

  const message = messageParts.join(nl)

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return encodedMessage
}

export default messageEncoding
