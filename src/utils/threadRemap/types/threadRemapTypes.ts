import { z } from 'zod'

import { gmailV1SchemaMessagePartSchema } from '../../../types/gmailTypes'

const PayloadHeaders = z.object({
  deliveredTo: z.string().nullable(),
  date: z.string().nullable(),
  from: z.string().nullable(),
  subject: z.string().nullable(),
  to: z.string().nullable(),
  cc: z.string().nullable(),
  bcc: z.string().nullable(),
})

const SimpleMessage = z.object({
  id: z.string(),
  threadId: z.string(),
  labelIds: z.array(z.string()),
  snippet: z.string(),
  payload: z.object({
    mimeType: z.string(),
    headers: PayloadHeaders,
    files: z.array(z.any()),
  }),
  sizeEstimate: z.number(),
  historyId: z.string(),
  internalDate: z.string(),
})

export const ThreadSimpleRemap = z.object({
  id: z.string(),
  historyId: z.string(),
  messages: z.array(SimpleMessage),
})

export type TThreadSimpleRemap = z.infer<typeof ThreadSimpleRemap>

const PayloadHeadersEnhanced = PayloadHeaders.extend({
  listUnsubscribe: z.string().nullable(),
})

const FullMessage = z.object({
  id: z.string(),
  threadId: z.string(),
  labelIds: z.array(z.string()),
  snippet: z.string(),
  payload: z.object({
    mimeType: z.string(),
    headers: PayloadHeadersEnhanced,
    body: z.object({
      emailHTML: z.string(),
      emailFileHTML: z.array(z.any()),
      removedTrackers: z.array(z.string()).optional(),
    }),
    files: z.array(gmailV1SchemaMessagePartSchema),
    parts: z.array(gmailV1SchemaMessagePartSchema).optional(),
  }),
  sizeEstimate: z.number(),
  historyId: z.string(),
  internalDate: z.string(),
})

export const ThreadObject = z.object({
  id: z.string(),
  historyId: z.string(),
  messages: z.array(FullMessage),
})
