// Generated by ts-to-zod
import { gmail_v1 } from 'googleapis/build/src/apis/gmail'
import { z } from 'zod'

export const gmailV1SchemaAutoForwardingSchema = z.object({
  disposition: z.string().optional().nullable(),
  emailAddress: z.string().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
})

export const gmailV1SchemaBatchDeleteMessagesRequestSchema = z.object({
  ids: z.array(z.string()).optional().nullable(),
})

export const gmailV1SchemaBatchModifyMessagesRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  ids: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})

export const gmailV1SchemaDelegateSchema = z.object({
  delegateEmail: z.string().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
})

export const gmailV1SchemaFilterActionSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  forward: z.string().optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})

export const gmailV1SchemaFilterCriteriaSchema = z.object({
  excludeChats: z.boolean().optional().nullable(),
  from: z.string().optional().nullable(),
  hasAttachment: z.boolean().optional().nullable(),
  negatedQuery: z.string().optional().nullable(),
  query: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
  sizeComparison: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  to: z.string().optional().nullable(),
})

export const gmailV1SchemaForwardingAddressSchema = z.object({
  forwardingEmail: z.string().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
})

export const gmailV1SchemaImapSettingsSchema = z.object({
  autoExpunge: z.boolean().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
  expungeBehavior: z.string().optional().nullable(),
  maxFolderSize: z.number().optional().nullable(),
})

export const gmailV1SchemaLabelColorSchema = z.object({
  backgroundColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
})

export const gmailV1SchemaLanguageSettingsSchema = z.object({
  displayLanguage: z.string().optional().nullable(),
})

export const gmailV1SchemaListDelegatesResponseSchema = z.object({
  delegates: z.array(gmailV1SchemaDelegateSchema).optional(),
})

export const gmailV1SchemaListForwardingAddressesResponseSchema = z.object({
  forwardingAddresses: z.array(gmailV1SchemaForwardingAddressSchema).optional(),
})

export const gmailV1SchemaMessagePartBodySchema = z.object({
  attachmentId: z.string().optional().nullable(),
  data: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
})

export const gmailV1SchemaMessagePartHeaderSchema = z.object({
  name: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
})

export const gmailV1SchemaModifyMessageRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})

export const gmailV1SchemaModifyThreadRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})

export const gmailV1SchemaPopSettingsSchema = z.object({
  accessWindow: z.string().optional().nullable(),
  disposition: z.string().optional().nullable(),
})

export const gmailV1SchemaProfileSchema = z.object({
  emailAddress: z.string().optional().nullable(),
  historyId: z.string().optional().nullable(),
  messagesTotal: z.number().optional().nullable(),
  threadsTotal: z.number().optional().nullable(),
})

export const gmailV1SchemaSmimeInfoSchema = z.object({
  encryptedKeyPassword: z.string().optional().nullable(),
  expiration: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
  issuerCn: z.string().optional().nullable(),
  pem: z.string().optional().nullable(),
  pkcs12: z.string().optional().nullable(),
})

export const gmailV1SchemaSmtpMsaSchema = z.object({
  host: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  port: z.number().optional().nullable(),
  securityMode: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
})

export const gmailV1SchemaVacationSettingsSchema = z.object({
  enableAutoReply: z.boolean().optional().nullable(),
  endTime: z.string().optional().nullable(),
  responseBodyHtml: z.string().optional().nullable(),
  responseBodyPlainText: z.string().optional().nullable(),
  responseSubject: z.string().optional().nullable(),
  restrictToContacts: z.boolean().optional().nullable(),
  restrictToDomain: z.boolean().optional().nullable(),
  startTime: z.string().optional().nullable(),
})

export const gmailV1SchemaWatchRequestSchema = z.object({
  labelFilterAction: z.string().optional().nullable(),
  labelIds: z.array(z.string()).optional().nullable(),
  topicName: z.string().optional().nullable(),
})

export const gmailV1SchemaWatchResponseSchema = z.object({
  expiration: z.string().optional().nullable(),
  historyId: z.string().optional().nullable(),
})

export const gmailV1SchemaFilterSchema = z.object({
  action: gmailV1SchemaFilterActionSchema.optional(),
  criteria: gmailV1SchemaFilterCriteriaSchema.optional(),
  id: z.string().optional().nullable(),
})

export const gmailV1SchemaLabelSchema = z.object({
  color: gmailV1SchemaLabelColorSchema.optional(),
  id: z.string().optional().nullable(),
  labelListVisibility: z.string().optional().nullable(),
  messageListVisibility: z.string().optional().nullable(),
  messagesTotal: z.number().optional().nullable(),
  messagesUnread: z.number().optional().nullable(),
  name: z.string().optional().nullable(),
  threadsTotal: z.number().optional().nullable(),
  threadsUnread: z.number().optional().nullable(),
  type: z.string().optional().nullable(),
})

export type TGmailV1SchemaLabelSchema = z.infer<typeof gmailV1SchemaLabelSchema>

export const gmailV1SchemaListFiltersResponseSchema = z.object({
  filter: z.array(gmailV1SchemaFilterSchema).optional(),
})

export const gmailV1SchemaListLabelsResponseSchema = z.object({
  labels: z.array(gmailV1SchemaLabelSchema).optional(),
})

export const gmailV1SchemaListSmimeInfoResponseSchema = z.object({
  smimeInfo: z.array(gmailV1SchemaSmimeInfoSchema).optional(),
})

export const gmailV1SchemaMessagePartSchema: z.ZodSchema<gmail_v1.Schema$MessagePart> =
  z.lazy(() =>
    z.object({
      body: gmailV1SchemaMessagePartBodySchema.optional(),
      filename: z.string().optional().nullable(),
      headers: z.array(gmailV1SchemaMessagePartHeaderSchema).optional(),
      mimeType: z.string().optional().nullable(),
      partId: z.string().optional().nullable(),
      parts: z.array(gmailV1SchemaMessagePartSchema).optional(),
    })
  )

export const gmailV1SchemaSendAsSchema = z.object({
  displayName: z.string().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  replyToAddress: z.string().optional().nullable(),
  sendAsEmail: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
  smtpMsa: gmailV1SchemaSmtpMsaSchema.optional(),
  treatAsAlias: z.boolean().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
})

export const gmailV1SchemaListSendAsResponseSchema = z.object({
  sendAs: z.array(gmailV1SchemaSendAsSchema).optional(),
})

export const gmailV1SchemaMessageSchema = z.object({
  historyId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  internalDate: z.string().optional().nullable(),
  labelIds: z.array(z.string()).optional().nullable(),
  payload: gmailV1SchemaMessagePartSchema.optional(),
  raw: z.string().optional().nullable(),
  sizeEstimate: z.number().optional().nullable(),
  snippet: z.string().optional().nullable(),
  threadId: z.string().optional().nullable(),
})

export const gmailV1SchemaThreadSchema = z.object({
  historyId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  snippet: z.string().optional().nullable(),
})

export const gmailV1SchemaDraftSchema = z.object({
  id: z.string().optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})

export const gmailV1SchemaHistoryLabelAddedSchema = z.object({
  labelIds: z.array(z.string()).optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})

export const gmailV1SchemaHistoryLabelRemovedSchema = z.object({
  labelIds: z.array(z.string()).optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})

export const gmailV1SchemaHistoryMessageAddedSchema = z.object({
  message: gmailV1SchemaMessageSchema.optional(),
})

export const gmailV1SchemaHistoryMessageDeletedSchema = z.object({
  message: gmailV1SchemaMessageSchema.optional(),
})

export const gmailV1SchemaListDraftsResponseSchema = z.object({
  drafts: z.array(gmailV1SchemaDraftSchema).optional(),
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
})

export const gmailV1SchemaListMessagesResponseSchema = z.object({
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
})

export const gmailV1SchemaListThreadsResponseSchema = z.object({
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
  threads: z.array(gmailV1SchemaThreadSchema).optional(),
})

export const gmailV1SchemaHistorySchema = z.object({
  id: z.string().optional().nullable(),
  labelsAdded: z.array(gmailV1SchemaHistoryLabelAddedSchema).optional(),
  labelsRemoved: z.array(gmailV1SchemaHistoryLabelRemovedSchema).optional(),
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  messagesAdded: z.array(gmailV1SchemaHistoryMessageAddedSchema).optional(),
  messagesDeleted: z.array(gmailV1SchemaHistoryMessageDeletedSchema).optional(),
})

export const gmailV1SchemaListHistoryResponseSchema = z.object({
  history: z.array(gmailV1SchemaHistorySchema).optional(),
  historyId: z.string().optional().nullable(),
  nextPageToken: z.string().optional().nullable(),
})
