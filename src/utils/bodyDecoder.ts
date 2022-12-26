import AutoLinker from 'npm:autolinker'
import * as cheerio from 'npm:cheerio'
import { gmail_v1 } from 'npm:googleapis'

import * as global from '../constants/globalConstants.ts'
import { IAttachment } from '../types/emailAttachmentTypes.ts'
import { baseBase64, decodeBase64 } from './decodeBase64.ts'
import removeScripts from './removeScripts.ts'
import removeTrackers from './removeTrackers.ts'

let decodedString: string | undefined
let localMessageId: string | null
let decodedResult: Array<string | Promise<any | Error>> = []
let localGmail: gmail_v1.Gmail | null = null

/**
 * @function enhancePlainText
 * @param localString a plain text string that needs to be enhanced.
 * @returns it will return a string that has been line "breaked" and has activated links.
 */

const enhancePlainText = (localString: string) => {
  const enhancedText = () => {
    const lineBreakRegex = /(?:\r\n|\r|\n)/g
    return (
      AutoLinker.link(localString, { email: false }).replace(
        lineBreakRegex,
        '<br>'
      ) ?? ''
    )
  }
  return enhancedText()
}

/**
 * @function inlineImageDecoder
 * @property {object} params - parameter object that contains the relevant id of the message and the object with attachment data.
 * @returns returns a response based on an API call to fetch the attachment base64 data, or null if the response is not available.
 */

const inlineImageDecoder = async ({
  attachmentData,
  messageId,
}: {
  messageId: string
  attachmentData: gmail_v1.Schema$MessagePart
}) => {
  const { body, filename, mimeType, headers } = attachmentData
  const getAttachment = async () => {
    if (localGmail && body?.attachmentId) {
      try {
        const response = await localGmail.users.messages.attachments.get({
          userId: global.USER,
          messageId,
          id: body?.attachmentId,
        })
        if (response && response.data) {
          return response.data
        }
        return 'Message attachment not found...'
      } catch (err) {
        throw Error(`Get Attachment returned an error: ${err}`)
      }
    }
  }
  const response = await getAttachment()
  if (response && typeof response !== 'string' && response?.data) {
    const decodedB64 = baseBase64(response.data)
    const contentID = headers
      ?.find((e) => e.name === 'Content-ID' || e.name === 'Content-Id')
      ?.value?.replace(/<|>/gi, '')
    if (contentID) {
      const attachment = {
        mimeType,
        decodedB64,
        filename,
        contentID,
      }
      return attachment
    }
    return
  }
  return
}

// This function recursively loops in the emailbody to find a body to decode. If initially priotizes the last object in a parts array.
/**
 * @function loopThroughBodyParts
 * @param {object} params - parameter object that contains an inputObject and an abort signal.
 * @returns
 */
export const loopThroughBodyParts = async ({
  inputObject,
  signal,
}: {
  inputObject: gmail_v1.Schema$MessagePart
  signal?: AbortSignal
}): Promise<any> => {
  if (signal?.aborted) {
    throw new Error('Decoding aborted')
    // throw new Error(signal.reason)
  }
  const loopingFunction = async ({
    loopObject,
  }: {
    loopObject: gmail_v1.Schema$MessagePart
  }) => {
    try {
      const objectKeys = Object.keys(loopObject)
      for (const objectKey of objectKeys) {
        if (objectKey === 'body') {
          if (loopObject?.body?.size && loopObject?.body?.size > 0) {
            if (loopObject.body?.attachmentId && localMessageId) {
              // If it is an image, use the image decoder
              const imageObjectPromise = inlineImageDecoder({
                attachmentData: loopObject,
                messageId: localMessageId,
              })
              if (imageObjectPromise) {
                decodedResult.push(imageObjectPromise)
              }
            }
            decodedString = decodeBase64(`${loopObject?.body?.data}`)
            if (loopObject.mimeType !== 'text/plain' && decodedString) {
              decodedResult.push(decodedString)
            } else if (loopObject.mimeType === 'text/plain' && decodedString) {
              const localString = decodedString
              const check = enhancePlainText(localString)
              decodedResult.push(check)
            }
          }
        }
        if (objectKey === 'parts') {
          if (
            (loopObject?.body?.size === 0 ||
              !Object.prototype.hasOwnProperty.call(loopObject, 'body')) &&
            loopObject?.parts
          ) {
            // If the object has parts of its own, loop through all of them to decode
            loopObject.parts.forEach((part) => {
              loopingFunction({
                loopObject: part,
              })
            })
          }
        }
      }
      if (!signal?.aborted) {
        const result = await Promise.all(decodedResult)
        return result
      }
      return null
    } catch (err) {
      decodedResult = []
      return err
    }
  }
  return loopingFunction({ loopObject: inputObject })
}

/**
 * @function orderArrayPerType
 * @param response - an array that can contain objects and strings
 * @returns {object} that contains the all the strings in an array as the emailHTML, and all the objects in the array as emailFileHTML
 */

export const orderArrayPerType = (
  response: Array<string | IAttachment>
): { emailHTML: string[]; emailFileHTML: IAttachment[] } => {
  const firstStringOnly: string[] = []
  const objectOnly: IAttachment[] = []
  for (const item of response) {
    if (typeof item === 'string') {
      firstStringOnly.push(item)
    }
    if (typeof item === 'object') {
      objectOnly.push(item)
    }
  }
  return { emailHTML: firstStringOnly, emailFileHTML: objectOnly }
}

/**
 * @function prioritizeHTMLbodyObject
 * Prioritise the string object that has the HTML tag in it, ignore the others.
 * @param response - takes in the response, as an array of objects and strings
 * @returns if the param object only contains one string, return that. If not, it attempts to find the most html rich string.
 */

export const prioritizeHTMLbodyObject = (response: {
  emailHTML: string[]
  emailFileHTML: IAttachment[]
}) => {
  let htmlObject = ''
  let noHtmlObject = ''

  if (response.emailHTML.length === 1) {
    return { ...response, emailHTML: response.emailHTML[0] }
  }
  if (response.emailHTML.length > 1) {
    for (const item of response.emailHTML) {
      if (item.includes('</html>')) {
        htmlObject = item
      } else if (item.startsWith('<')) {
        noHtmlObject = item
      } else {
        noHtmlObject = item
      }
    }
  }

  if (htmlObject.length > 0) {
    return { ...response, emailHTML: htmlObject }
  }
  return { ...response, emailHTML: noHtmlObject }
}

/**
 * @function placeInlineImage
 * @param orderedObject - check the string body for CID (files) if there is a match, replace the img tag with the fetched file.
 * @returns {Object} - an object with emailHTML and emailFileHTML
 */

// TODO: Possible enhancement: Check for header on file: Content-Disposition "attachment"
// Check the string body for CID (files) if there is a match, replace the img tag with the fetched file
export const placeInlineImage = (orderedObject: {
  emailHTML: string
  emailFileHTML: IAttachment[]
}): { emailHTML: string; emailFileHTML: IAttachment[] } => {
  if (orderedObject.emailFileHTML.length > 0) {
    const processedObjectArray: IAttachment[] = []
    const $ = cheerio.load(orderedObject.emailHTML)

    for (const emailFileHTML of orderedObject.emailFileHTML) {
      const matchString = `cid:${emailFileHTML.contentID}`
      $('img').each((_, documentImage) => {
        if (documentImage.attribs.src === matchString) {
          $(documentImage).attr(
            'src',
            `data:${emailFileHTML.mimeType};base64,${emailFileHTML.decodedB64}`
          )
          processedObjectArray.push(emailFileHTML)
        }
      })
    }
    // If there are attachment objects left, filter out the ones that cannot be displayed in html.
    const unprocessedValidObjects = orderedObject.emailFileHTML
      .filter((item) => !processedObjectArray.includes(item))
      .filter((item) => item.mimeType !== global.MIME_TYPE_NO_INLINE)

    return { emailFileHTML: unprocessedValidObjects, emailHTML: $.html() }
  }
  return orderedObject
}

/**
 * @function bodyDecoder
 * @property {object} - object can contain messageId and should contain inputObject, and signals
 * @param messageId - takes in messageId to understand which message is being decoded
 * @param inputObject -  an object from the Gmail API, that is the message object
 * @param signal - an abort signal object to cancel the decoding process, if needed
 * @returns a promise that resolves with the decoded email object, sorted on emailHTML and emailFileHTML, and showing which trackers have been removed from the email.
 */

const bodyDecoder = async ({
  messageId,
  inputObject,
  signal,
  gmail,
}: {
  messageId: string | undefined | null
  inputObject: gmail_v1.Schema$MessagePart | undefined
  signal?: AbortSignal
  gmail: gmail_v1.Gmail | undefined
}): Promise<{
  emailHTML: string
  emailFileHTML: IAttachment[]
}> => {
  try {
    if (inputObject) {
      if (messageId) {
        localMessageId = messageId
      }
      if (gmail) {
        localGmail = gmail
      }
      const response = await loopThroughBodyParts({
        inputObject,
        signal,
      })
      // Reset the local variable for the next decode
      decodedResult = []

      // orderArrayPerType changes the response object into an object that can hold two objects: emailHTML[], emailFileHTML[]
      const ordered = orderArrayPerType(response)
      const prioritized = prioritizeHTMLbodyObject(ordered)
      const inlinedImages = placeInlineImage(prioritized)
      const removedTrackers = removeTrackers(inlinedImages)
      const removedScript = removeScripts(removedTrackers)
      return removedScript
    }
    // If there is no input object, return an empty object back
    return { emailHTML: '', emailFileHTML: [] }
  } catch (err) {
    return err
  }
}

export default bodyDecoder
