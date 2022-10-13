import { gmail_v1 } from 'googleapis'
import checkAttachment from './fetchAttachments'
import findHeader from './findHeader'

const remapPayloadHeaders = (rawMessage: gmail_v1.Schema$Message) => {
  return {
    deliveredTo: findHeader(rawMessage, 'Delivered-To'),
    date: findHeader(rawMessage, 'Date'),
    from: findHeader(rawMessage, 'From'),
    subject: findHeader(rawMessage, 'Subject'),
    to: findHeader(rawMessage, 'To'),
    cc: findHeader(rawMessage, 'Cc'),
    bcc: findHeader(rawMessage, 'Bcc'),
  }
}

const remapSimpleMessage = async (rawMessage: gmail_v1.Schema$Message) => {
  return {
    id: rawMessage.id,
    threadId: rawMessage.threadId,
    labelIds: rawMessage.labelIds,
    snippet: rawMessage.snippet,
    payload: {
      mimeType: rawMessage?.payload?.mimeType,
      headers: remapPayloadHeaders(rawMessage),
      files: checkAttachment(rawMessage),
    },
    sizeEstimate: rawMessage.sizeEstimate,
    historyId: rawMessage.historyId,
    internalDate: rawMessage.internalDate,
  }
}

export default async function threadSimpleRemap(
  rawObject: gmail_v1.Schema$Thread
) {
  if (rawObject.messages) {
    const mappedMessages = rawObject.messages.map((message) =>
      remapSimpleMessage(message)
    )

    return {
      id: rawObject.id,
      historyId: rawObject.historyId,
      messages: await Promise.all(mappedMessages),
    }
  }
  return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
}
