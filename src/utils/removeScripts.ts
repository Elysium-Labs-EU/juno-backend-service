import * as cheerio from 'npm:cheerio'

import { IAttachment } from '../types/emailAttachmentTypes.ts'

export default function removeScripts(orderedObject: {
  emailHTML: string
  emailFileHTML: IAttachment[]
}) {
  const $ = cheerio.load(orderedObject.emailHTML)
  $('script').each((_, foundScript) => {
    $(foundScript).remove()
  })

  return orderedObject
}
