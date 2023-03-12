import * as cheerio from 'cheerio'
import { isText } from 'domhandler'

import type { IBodyProps } from '../bodyDecoder/bodyDecoderTypes'

// All the words that indicate an unsubscribe link. Expand the list if new matches need to be found.
const CHECK_WORDS = [
  'afmelden',
  'unsubscribe',
  'optout',
  'subscription',
  'uit te schrijven',
  'turn them off',
  'uitschrijven',
  'no longer wish',
  'Opt-out',
]

const REGEX = new RegExp(CHECK_WORDS.join('|'), 'i')

/**
 * This function searches the HTML content of an email body for an unsubscribe link using the
 * Cheerio library and a regular expression. It looks for <a> tags that contain the regular
 * expression in their href attribute, or have text or a parent element that matches the
 * regular expression. It returns the last matching href value found, or null if no matches
 * were found.
 *
 * @param {IBodyProps} activeDocument - The email body object.
 *
 * @returns {string | null} The last matching href value, or null if no matches were found.
 *
 * @example
 *
 * // Case 1: Input object with matching <a> tag
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><p><a href="https://example.com/unsubscribe">Unsubscribe</a></p></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const unsubscribeLink = fetchUnsubscribeLink(activeDocument);
 * console.log(unsubscribeLink); // Output: 'https://example.com/unsubscribe'
 *
 * // Case 2: Input object without matching <a> tag
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><p>Hello, world!</p></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const unsubscribeLink = fetchUnsubscribeLink(activeDocument);
 * console.log(unsubscribeLink); // Output: null
 */

export default function fetchUnsubscribeLink(activeDocument: IBodyProps) {
  const $ = cheerio.load(activeDocument.emailHTML)

  const matchedElements: Array<string> = []
  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    const elementClass = $(documentLink).attr('class')
    const parentElement = $(documentLink).parent()

    if (elementHref && REGEX.test(elementHref)) {
      matchedElements.push(elementHref)
    }
    if (
      documentLink.childNodes
        .map((childNode) => {
          if (isText(childNode)) {
            return childNode.data ?? ''
          }
          return ''
        })
        .every((textNode) => REGEX.test(textNode)) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
    if (elementClass && REGEX.test(elementClass) && elementHref) {
      matchedElements.push(elementHref)
    }
    if (
      parentElement.text() &&
      REGEX.test(parentElement.text()) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
    const previousSibling = parentElement.prev()

    if (
      previousSibling.length &&
      previousSibling
        .find('*')
        // .filter((_, el) => el.nodeType === 3 && el.textContent.trim())
        .toArray()
        .every((el) => REGEX.test($(el).text())) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
  })

  if (matchedElements.length > 0) {
    const lastMatch = matchedElements[matchedElements.length - 1]
    if (lastMatch) {
      return lastMatch
    } else {
      return null
    }
  } else {
    // If there are no matched elements, set it to null. This is required to overwrite any previous data.
    return null
  }
}
