import * as cheerio from 'cheerio'
import { IAttachment } from '../types/emailAttachmentTypes'

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
      if (parsedStyle[i]) {
        const parts = parsedStyle[i].match(/^([^:]+)\s*:\s*(.+)/)
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

export default function removeTrackers(orderedObject: {
  emailHTML: string
  emailFileHTML: IAttachment[]
}) {
  const localCopyOrderedObject: {
    emailHTML: string
    emailFileHTML: IAttachment[]
    removedTrackers: string[]
  } = { ...orderedObject, removedTrackers: [] }

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
      if (srcOfTracker) {
        localCopyOrderedObject.removedTrackers.push(srcOfTracker.value)
      }
    }
  })
  localCopyOrderedObject.emailHTML = $.html()
  return localCopyOrderedObject
}
