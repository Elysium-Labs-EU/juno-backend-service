import * as cheerio from 'cheerio'

import type { IBodyProps } from './../../bodyDecoderTypes'

const TRACKERS_SELECTORS = [
  { attribute: 'width', value: '0' },
  { attribute: 'width', value: '0 !important' },
  { attribute: 'width', value: '1' },
  { attribute: 'width', value: '1 !important' },
  { attribute: 'width', value: '1px !important' },
  { attribute: 'height', value: '0' },
  { attribute: 'height', value: '0 !important' },
  { attribute: 'height', value: '1' },
  { attribute: 'height', value: '1 !important' },
  { attribute: 'height', value: '1px !important' },
  { attribute: 'display', value: 'none' },
  { attribute: 'display', value: 'none !important' },
]
const TRACKERS_SELECTORS_INCLUDES = [
  { attribute: 'src', value: 'http://mailstat.us' },
  { attribute: 'src', value: 'https://open.convertkit-' },
]

function parseStyleIntoObject(documentImage: cheerio.Element) {
  let foundImage: cheerio.Element | null = null
  const fetchedStyle = documentImage.attributes.filter(
    (attribute) => attribute.name === 'style'
  )
  if (fetchedStyle.length > 0) {
    const parsedStyle = fetchedStyle
      .map((item) => item.value?.split(/\s*;\s*/g))
      .flat(1)
    for (let i = 0; parsedStyle.length > i; i += 1) {
      const parsedStyleEntry = parsedStyle[i]
      if (parsedStyleEntry) {
        const parts = parsedStyleEntry.match(/^([^:]+)\s*:\s*(.+)/)
        if (
          parts &&
          TRACKERS_SELECTORS.some(
            (checkValue) => parts[1] === checkValue.attribute
          ) &&
          TRACKERS_SELECTORS.some((checkValue) => parts[2] === checkValue.value)
        ) {
          foundImage = documentImage
          break
        }
      }
    }
  }
  return foundImage
}

function detectAndRemove(documentImage: cheerio.Element) {
  let foundImage: cheerio.Element | null = null
  if (
    TRACKERS_SELECTORS.filter(
      (checkValue) =>
        documentImage.attributes.some((item) => {
          if (item.name === checkValue.attribute) {
            return item.value === checkValue.value
          }
        }) === true
    ).length > 0 ||
    TRACKERS_SELECTORS_INCLUDES.filter((checkValueInclude) =>
      documentImage.attributes.some((item) => {
        if (item.name === checkValueInclude.attribute) {
          return item.value === checkValueInclude.value
        }
      })
    ).length > 0
  ) {
    foundImage = documentImage
  }
  return foundImage
}

/**
 * This function removes tracking images from the email body by looking for images with specific
 * attributes and styles that are commonly used for tracking purposes. It returns a new object with
 * the cleaned HTML, and an array of the removed trackers' URLs.
 *
 * @param {IBodyProps} orderedObject - An object that contains the email HTML and optional file attachments.
 *
 * @returns {IBodyProps} A new object with the cleaned HTML and an array of the removed trackers' URLs.
 *
 * @example
 *
 * // Case 1: Input email with tracking images
 * const emailBody = {
 *   emailHTML: '<img src="http://mailstat.us/tracker1.jpg" style="height:0;width:1px;"> \
 *               <img src="https://open.convertkit-1.com/tracker2.gif" style="height:0;width:0">',
 *   emailFileHTML: []
 * };
 * const cleanedEmail = removeTrackers(emailBody);
 * console.log(cleanedEmail.emailHTML);
 * // Output: '<html><head></head><body></body></html>'
 * console.log(cleanedEmail.removedTrackers);
 * // Output: ['http://mailstat.us/tracker1.jpg', 'https://open.convertkit-1.com/tracker2.gif']
 *
 * // Case 2: Input email without tracking images
 * const emailBody = {
 *   emailHTML: '<html><head></head><body><p>This email does not contain any tracking images.</p></body></html>',
 *   emailFileHTML: []
 * };
 * const cleanedEmail = removeTrackers(emailBody);
 * console.log(cleanedEmail.emailHTML);
 * // Output: '<html><head></head><body><p>This email does not contain any tracking images.</p></body></html>'
 * console.log(cleanedEmail.removedTrackers);
 * // Output: []
 */

export default function removeTrackers(orderedObject: IBodyProps) {
  const localCopyOrderedObject: IBodyProps = {
    ...orderedObject,
    removedTrackers: [],
  }

  const $ = cheerio.load(orderedObject.emailHTML)
  let foundImage: cheerio.Element | null = null
  $('img').each((_, documentImage) => {
    // First attempt to find a tracker based on the inline styles - the other method is regular attributes.
    const imageWithInlineSrc = documentImage.attributes.filter(
      (item) => item.name === 'style'
    )
    if (imageWithInlineSrc !== null && imageWithInlineSrc.length > 0) {
      const response = parseStyleIntoObject(documentImage)
      if (response) {
        foundImage = response
      }
    } else {
      const response = detectAndRemove(documentImage)
      if (response) {
        foundImage = response
      }
    }
    if (foundImage) {
      $(foundImage).remove()
      const srcOfTracker = documentImage?.attributes.filter(
        (attribute) => attribute.name === 'src'
      )[0]
      if (srcOfTracker && localCopyOrderedObject.removedTrackers) {
        localCopyOrderedObject.removedTrackers.push(srcOfTracker.value)
      }
    }
  })
  localCopyOrderedObject.emailHTML = $.html()
  return localCopyOrderedObject
}
