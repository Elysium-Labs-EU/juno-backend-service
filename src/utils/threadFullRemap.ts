import { gmail_v1 } from 'googleapis'

import bodyDecoder from './bodyDecoder'
import checkAttachment from './fetchAttachments'
import findHeader from './findHeader'

/**
 *
 * @param unsubscribeLink - a string or undefined - coming from the Gmail header
 * @returns nothing if there is no input, prefer the regular page link over the mailto link. If there is input, it will return at least a string.
 */
function handleListUnsubscribe(unsubscribeLink: string | undefined | null) {
  if (unsubscribeLink) {
    const splittedUnsubscribe = unsubscribeLink
      .split(',')
      .map((link) => link.trim().replace(/(<|>)+/g, ''))
    if (splittedUnsubscribe.length === 1) {
      return splittedUnsubscribe[0]
    }
    const preferNoMailLink = splittedUnsubscribe.filter(
      (item) => !item.startsWith('mailto')
    )
    if (preferNoMailLink.length === 0) {
      return splittedUnsubscribe[0]
    }
    return preferNoMailLink[0]
  }
}

const remapPayloadHeaders = (rawMessage: gmail_v1.Schema$Message) => {
  return {
    deliveredTo: findHeader(rawMessage, 'Delivered-To'),
    date: findHeader(rawMessage, 'Date'),
    from: findHeader(rawMessage, 'From'),
    subject: findHeader(rawMessage, 'Subject'),
    listUnsubscribe: handleListUnsubscribe(
      findHeader(rawMessage, 'List-Unsubscribe')
    ),
    to: findHeader(rawMessage, 'To'),
    cc: findHeader(rawMessage, 'Cc'),
    bcc: findHeader(rawMessage, 'Bcc'),
  }
}

export const remapFullMessage = async (
  rawMessage: gmail_v1.Schema$Message,
  gmail: gmail_v1.Gmail
) => {
  return {
    id: rawMessage.id,
    threadId: rawMessage.threadId,
    labelIds: rawMessage.labelIds,
    snippet: rawMessage.snippet,
    payload: {
      mimeType: rawMessage?.payload?.mimeType,
      headers: remapPayloadHeaders(rawMessage),
      body: await bodyDecoder({
        inputObject: rawMessage.payload,
        messageId: rawMessage?.id,
        gmail,
      }),
      files: checkAttachment(rawMessage),
      parts: rawMessage?.payload?.parts,
    },
    sizeEstimate: rawMessage.sizeEstimate,
    historyId: rawMessage.historyId,
    internalDate: rawMessage.internalDate,
  }
}

export default async function threadFullRemap(
  rawObject: gmail_v1.Schema$Thread,
  gmail: gmail_v1.Gmail
) {
  if (rawObject.messages) {
    const mappedMessages = rawObject.messages.map((message) =>
      remapFullMessage(message, gmail)
    )

    return {
      id: rawObject.id,
      historyId: rawObject.historyId,
      messages: await Promise.all(mappedMessages),
    }
  }
  return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
}
