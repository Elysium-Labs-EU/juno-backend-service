import { gmail_v1 } from 'googleapis'

let foundAttachments: Array<gmail_v1.Schema$MessagePart> = []
export const loopThroughParts = ({
  input,
  reset = false,
}: {
  input: Array<gmail_v1.Schema$MessagePart> | undefined
  reset?: boolean
}) => {
  if (reset) {
    foundAttachments = []
  }
  if (!input) {
    return []
  }

  for (const inputParts of input) {
    if (inputParts.parts) {
      loopThroughParts({ input: inputParts.parts })
    }
    if (
      !inputParts.parts &&
      inputParts.filename &&
      inputParts?.headers?.some((header) =>
        header?.name?.includes('Content-Disposition')
      )
    ) {
      foundAttachments.push(inputParts)
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
  if (message?.payload?.parts) {
    return loopThroughParts({ input: message.payload.parts, reset: true })
  }
  return []
}
