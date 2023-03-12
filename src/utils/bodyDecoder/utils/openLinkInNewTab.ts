import * as cheerio from 'cheerio'

import type { IBodyProps } from '../bodyDecoderTypes'
/* eslint-disable no-underscore-dangle */

/**
 * This function modifies all <a> tags in the HTML content of an email body to open the link in a new
 * tab using the Cheerio library. It also adds the `rel="noreferer noopener"` and `aria-label="Opens in
 * new tab"` attributes to each <a> tag. It returns a new object with the modified email HTML content.
 *
 * @param {IBodyProps} activeDocument - The email body object.
 *
 * @returns {IBodyProps} A new object with the modified email HTML content.
 *
 * @example
 *
 * // Case 1: Input object with <a> tags
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><p><a href="https://example.com">Example</a></p></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedDocument = openLinkInNewTab(activeDocument);
 * console.log(modifiedDocument.emailHTML);
 * // Output: '<html><head></head><body><p><a href="https://example.com" target="_blank" rel="noreferer noopener" aria-label="Opens in new tab">Example</a></p></body></html>'
 *
 * // Case 2: Input object without <a> tags
 * const activeDocument = {
 *   emailHTML: '<html><head></head><body><p>Hello, world!</p></body></html>',
 *   emailFileHTML: [],
 *   removedTrackers: [],
 * };
 * const modifiedDocument = openLinkInNewTab(activeDocument);
 * console.log(modifiedDocument.emailHTML);
 * // Output: '<html><head></head><body><p>Hello, world!</p></body></html>'
 */

export default function openLinkInNewTab(activeDocument: IBodyProps) {
  const $ = cheerio.load(activeDocument.emailHTML)
  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    if (elementHref && !elementHref.includes('mailto:')) {
      $(documentLink).attr('target', '_blank')
      $(documentLink).attr('rel', 'noreferer noopener')
      $(documentLink).attr('aria-label', 'Opens in new tab')
    }
  })

  return { ...activeDocument, emailHTML: $.html() }
}
