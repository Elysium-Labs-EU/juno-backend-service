import fs from 'fs'

interface ICustomFile {
  /**
   * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
   * event), this property says how many bytes of the file have been written to disk yet.
   */
  size: number

  /**
   * The path this file is being written to. You can modify this in the `'fileBegin'` event in case
   * you are unhappy with the way formidable generates a temporary path for your files.
   */
  filepath: string

  /**
   * The name this file had according to the uploading client.
   */
  originalFilename: string | null

  /**
   * Calculated based on options provided
   */
  newFilename: string

  /**
   * The mime type of this file, according to the uploading client.
   */
  mimetype: string | null

  /**
   * A Date object (or `null`) containing the time this file was last written to. Mostly here for
   * compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).
   */
  mtime?: Date | null | undefined

  hashAlgorithm: false | 'sha1' | 'md5' | 'sha256'

  /**
   * If `options.hashAlgorithm` calculation was set, you can read the hex digest out of this var
   * (at the end it will be a string).
   */
  hash?: string | null
}

interface IFormidableFileArray {
  file: ICustomFile[]
}

export interface IMessageEncoding {
  body: string | null | undefined
  subject: string | null | undefined
  to: string[] | null | undefined
  cc: string[] | null | undefined
  bcc: string[] | null | undefined
  sender: string | null | undefined
  signature: string | null | undefined
  from: string | null | undefined
  files: string[] | IFormidableFileArray
}

const messageEncoding = ({
  body,
  subject,
  to,
  cc,
  bcc,
  signature,
  files,
}: // from,
IMessageEncoding): string => {
  const nl = '\n'
  const boundary = '__juno__'

  const utf8Subject = subject
    ? `=?utf-8?B?${Buffer.from(subject[0] ?? '').toString('base64')}?=`
    : ''

  // TODO: Check the from sending pattern - to have the name of the sender as a display name
  const messageParts = [
    // `From: ${from}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    // 'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,

    'Content-Type: multipart/alternative; boundary=' + boundary + nl,
    '--' + boundary,

    // 'Content-Type: text/plain; charset=UTF-8',
    // 'Content-Transfer-Encoding: base64' + nl,
    // Utilities.base64Encode(msg.body.text, Utilities.Charset.UTF_8) + nl,
    // '--' + boundary,

    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64' + nl,
    // Utilities.base64Encode(msg.body.html, Utilities.Charset.UTF_8) + nl,
    `${body}` + nl,

    '',
    // `${body}`,
    `${signature && signature.length > 0 && signature}`,
  ]

  // Handle filesArray coming via the api request here.
  if ('file' in files && files.file.length > 0) {
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
