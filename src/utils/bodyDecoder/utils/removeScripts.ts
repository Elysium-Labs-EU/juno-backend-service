import * as cheerio from 'cheerio'

import type { IBodyProps } from '../bodyDecoderTypes'

/**
 * This function removes all <script> tags from the HTML content of an email body using the
 * Cheerio library. It modifies the input object in place and returns it.
 *
 * @param {IBodyProps} orderedObject - The email body object.
 *
 * @returns {IBodyProps} The modified email body object.
 *
 * @example
 *
 * // Case 1: Input object with <script> tags
 * const orderedObject = {
 *   emailHTML: '<html><head></head><body><script>alert("Hello, world!")</script></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedObject = removeScripts(orderedObject);
 * console.log(modifiedObject.emailHTML);
 * // Output: '<html><head></head><body></body></html>'
 *
 * // Case 2: Input object without <script> tags
 * const orderedObject = {
 *   emailHTML: '<html><head></head><body><p>Hello, world!</p></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedObject = removeScripts(orderedObject);
 * console.log(modifiedObject.emailHTML);
 * // Output: '<html><head></head><body><p>Hello, world!</p></body></html>'
 */

export default function removeScripts(orderedObject: IBodyProps) {
  const $ = cheerio.load(orderedObject.emailHTML)
  $('script').each((_, foundScript) => {
    $(foundScript).remove()
  })

  return orderedObject
}
