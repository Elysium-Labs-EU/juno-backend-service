import * as cheerio from 'cheerio'

import type { IBodyProps } from '../../bodyDecoderTypes'

/**
 * This function modifies the color of all signature <div> tags in the HTML content of an email
 * body to use a specific color using the Cheerio library. It adds the style attribute with the
 * CSS property "color: var(--color-neutral-400) !important" to each matching <div> tag. It returns
 * a new object with the modified email HTML content.
 *
 * @param {IBodyProps} activeDocument - The email body object.
 *
 * @returns {IBodyProps} A new object with the modified email HTML content.
 *
 * @example
 *
 * // Case 1: Input object with signature <div> tag
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><div class="signature"><p>This is a signature</p></div><div><p>This is not a signature</p></div></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedDocument = changeSignatureColor(activeDocument);
 * console.log(modifiedDocument.emailHTML);
 * // Output: '<html><head></head><body><div class="signature" style="color: var(--color-neutral-400) !important;"><p>This is a signature</p></div><div><p>This is not a signature</p></div></body></html>'
 *
 * // Case 2: Input object without signature <div> tag
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><div class="other"><p>This is not a signature</p></div></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedDocument = changeSignatureColor(activeDocument);
 * console.log(modifiedDocument.emailHTML);
 * // Output: '<html><head></head><body><div class="other"><p>This is not a signature</p></div></body></html>'
 */

export default function changeSignatureColor(activeDocument: IBodyProps) {
  const $ = cheerio.load(activeDocument.emailHTML)

  $('div[class*="signature"]').each((_, element) => {
    $(element).attr('style', 'color: var(--color-neutral-400) !important')
  })

  return { ...activeDocument, emailHTML: $.html() }
}
