import { gmail_v1 } from 'npm:googleapis'

let foundAttachments: gmail_v1.Schema$MessagePart[] = []
const loopThroughParts = ({
  input,
  reset = false,
}: {
  input: gmail_v1.Schema$MessagePart[] | undefined
  reset?: boolean
}) => {
  // Use the reset function to clear out the attachment array on each full new run.
  if (reset) {
    foundAttachments = []
  }
  if (input) {
    for (const inputParts of input) {
      if (Object.prototype.hasOwnProperty.call(inputParts, 'parts')) {
        loopThroughParts({ input: inputParts.parts })
      }
      if (
        !Object.prototype.hasOwnProperty.call(inputParts, 'parts') &&
        Object.prototype.hasOwnProperty.call(inputParts, 'filename') &&
        inputParts?.headers?.find((header) =>
          header?.name?.includes('Content-Disposition')
        )
      ) {
        foundAttachments.push(inputParts)
      }
    }
  }
  return foundAttachments
}

/**
 * @function checkAttachment
 * @param message - it takes in a message object.
 * The function sends a reset flag on the first run, this is to clear out the recursive function.
 * @returns returns an empty array on unsuccesful detection of files, or an array of files (MessagePart)
 */

export default function checkAttachment(message: gmail_v1.Schema$Message) {
  if (Object.prototype.hasOwnProperty.call(message?.payload, 'parts')) {
    return loopThroughParts({ input: message?.payload?.parts, reset: true })
  }
  return []
}
