import { gmail_v1 } from 'googleapis'

import bodyDecoder from '../bodyDecoder/bodyDecoder'
import checkAttachment from '../fetchAttachments/fetchAttachments'
import findHeader from '../findHeader'
import handleListUnsubscribe from '../handleListUnsubscribe/handleListUnsubscribe'
import { ThreadObject } from './types/threadRemapTypes'

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

    const result = {
      id: rawObject.id,
      historyId: rawObject.historyId,
      messages: await Promise.all(mappedMessages),
    }
    ThreadObject.parse(result)

    return result
  }
  return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
}
