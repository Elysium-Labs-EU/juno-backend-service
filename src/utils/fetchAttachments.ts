import { gmail_v1 } from 'googleapis'

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
    for (let i = 0; input.length > i; i += 1) {
      if (Object.prototype.hasOwnProperty.call(input[i], 'parts')) {
        loopThroughParts({ input: input[i].parts })
      }
      if (
        !Object.prototype.hasOwnProperty.call(input[i], 'parts') &&
        Object.prototype.hasOwnProperty.call(input[i], 'filename') &&
        input[i]?.headers?.find((header) =>
          header?.name?.includes('Content-Disposition')
        )
      ) {
        foundAttachments.push(input[i])
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
    const parts = message?.payload?.parts?.filter((item) => item !== undefined)
    return loopThroughParts({ input: parts, reset: true })
  }
  return []
}
