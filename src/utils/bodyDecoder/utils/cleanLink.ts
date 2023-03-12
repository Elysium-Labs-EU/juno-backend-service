import * as cheerio from 'cheerio'

import type { IBodyProps } from '../bodyDecoderTypes'

const SEPERATOR = 'utm'
const LIMIT = 1

export default function cleanLink(activeDocument: IBodyProps) {
  const $ = cheerio.load(activeDocument.emailHTML)

  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    if (elementHref) {
      const [firstPartLink] = elementHref.split(SEPERATOR, LIMIT)
      if (firstPartLink && firstPartLink.length > 0) {
        $(documentLink).attr('href', firstPartLink)
      }
    }
  })

  return { ...activeDocument, emailHTML: $.html() }
}
