// src/server.ts
import http from 'http'

// src/routes/app.ts
import './node_modules/dotenv/config.js'
import * as Sentry2 from './node_modules/@sentry/node/cjs/index.js'
import compression from './node_modules/compression/index.js'
import RedisStore from './node_modules/connect-redis/dist/esm/index.js'
import express2 from './node_modules/express/index.js'
import session from './node_modules/express-session/index.js'
import { google as google29 } from './node_modules/googleapis/build/src/index.js'
import helmet from './node_modules/helmet/index.mjs'
import swaggerJSDoc from './node_modules/swagger-jsdoc/index.js'
import swaggerUI from './node_modules/swagger-ui-express/index.js'

// src/data/redis.ts
import { createClient } from './node_modules/redis/dist/index.js'

// src/utils/assertNonNullish.ts
function assertNonNullish(value, message) {
  if (value === null || value === void 0) {
    throw Error(message)
  }
}

// src/data/redis.ts
var cloudRedis = () => {
  assertNonNullish(process.env.REDIS_USER, 'No Redis User defined')
  assertNonNullish(process.env.REDIS_PASS, 'No Redis Pass defined')
  assertNonNullish(process.env.REDIS_PORT, 'No Redis Port defined')
  return createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  })
}
var initiateRedis = () => {
  const redisClient2 =
    process.env.NODE_ENV === 'development' ? createClient() : cloudRedis()
  redisClient2.connect().catch(console.error)
  return redisClient2
}
var redis_default = initiateRedis

// src/middleware/loggerMiddleware.ts
import { Logtail } from './node_modules/@logtail/node/dist/cjs/index.js'
import winston from './node_modules/winston/lib/winston.js'
var isDevelopment = process.env.NODE_ENV !== 'production'
var logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN
var logger = isDevelopment
  ? winston.createLogger({
      level: 'info',
      // Log only info and above level messages (can be error, warn, info, verbose, debug, silly)
      format: winston.format.json(),
      defaultMeta: { service: 'juno-backend' },
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    })
  : new Logtail(logtailSourceToken ?? '')
if (isDevelopment && 'add' in logger) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}
var loggerMiddleware_default = logger

// src/utils/initSentry.ts
import * as Sentry from './node_modules/@sentry/node/cjs/index.js'
import { ProfilingIntegration } from './node_modules/@sentry/profiling-node/lib/index.js'
import * as Tracing from './node_modules/@sentry/tracing/cjs/index.js'
function initSentry(app2) {
  assertNonNullish(process.env.SENTRY_DSN, 'No Sentry DSN provided')
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      profilesSampleRate: 1,
      // Profiling sample rate is relative to tracesSampleRate
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: app2 }),
        new ProfilingIntegration(),
      ],
    })
  }
}

// src/routes/index.ts
import express from './node_modules/express/index.js'

// src/api/Base/getBase.ts
import { z as z4 } from './node_modules/zod/lib/index.mjs'

// src/constants/globalConstants.ts
var ARCHIVE_LABEL = 'ARCHIVE'
var DRAFT_LABEL = 'DRAFT'
var INBOX_LABEL = 'INBOX'
var INVALID_SESSION = 'Invalid session'
var INVALID_TOKEN = 'Invalid token'
var MIME_TYPE_NO_INLINE = 'application/octet-stream'
var SENT_LABEL = 'SENT'
var UNREAD_LABEL = 'UNREAD'
var USER = 'me'

// src/types/otherTypes.ts
import { z as z3 } from './node_modules/zod/lib/index.mjs'

// src/types/gmailTypes.ts
import { z } from './node_modules/zod/lib/index.mjs'
var gmailV1SchemaAutoForwardingSchema = z.object({
  disposition: z.string().optional().nullable(),
  emailAddress: z.string().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
})
var gmailV1SchemaBatchDeleteMessagesRequestSchema = z.object({
  ids: z.array(z.string()).optional().nullable(),
})
var gmailV1SchemaBatchModifyMessagesRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  ids: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})
var gmailV1SchemaDelegateSchema = z.object({
  delegateEmail: z.string().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
})
var gmailV1SchemaFilterActionSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  forward: z.string().optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})
var gmailV1SchemaFilterCriteriaSchema = z.object({
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
var gmailV1SchemaForwardingAddressSchema = z.object({
  forwardingEmail: z.string().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
})
var gmailV1SchemaImapSettingsSchema = z.object({
  autoExpunge: z.boolean().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
  expungeBehavior: z.string().optional().nullable(),
  maxFolderSize: z.number().optional().nullable(),
})
var gmailV1SchemaLabelColorSchema = z.object({
  backgroundColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
})
var gmailV1SchemaLanguageSettingsSchema = z.object({
  displayLanguage: z.string().optional().nullable(),
})
var gmailV1SchemaListDelegatesResponseSchema = z.object({
  delegates: z.array(gmailV1SchemaDelegateSchema).optional(),
})
var gmailV1SchemaListForwardingAddressesResponseSchema = z.object({
  forwardingAddresses: z.array(gmailV1SchemaForwardingAddressSchema).optional(),
})
var gmailV1SchemaMessagePartBodySchema = z.object({
  attachmentId: z.string().optional().nullable(),
  data: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
})
var gmailV1SchemaMessagePartHeaderSchema = z.object({
  name: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
})
var gmailV1SchemaModifyMessageRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})
var gmailV1SchemaModifyThreadRequestSchema = z.object({
  addLabelIds: z.array(z.string()).optional().nullable(),
  removeLabelIds: z.array(z.string()).optional().nullable(),
})
var gmailV1SchemaPopSettingsSchema = z.object({
  accessWindow: z.string().optional().nullable(),
  disposition: z.string().optional().nullable(),
})
var gmailV1SchemaProfileSchema = z.object({
  emailAddress: z.string().optional().nullable(),
  historyId: z.string().optional().nullable(),
  messagesTotal: z.number().optional().nullable(),
  threadsTotal: z.number().optional().nullable(),
})
var gmailV1SchemaSmimeInfoSchema = z.object({
  encryptedKeyPassword: z.string().optional().nullable(),
  expiration: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
  issuerCn: z.string().optional().nullable(),
  pem: z.string().optional().nullable(),
  pkcs12: z.string().optional().nullable(),
})
var gmailV1SchemaSmtpMsaSchema = z.object({
  host: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  port: z.number().optional().nullable(),
  securityMode: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
})
var gmailV1SchemaVacationSettingsSchema = z.object({
  enableAutoReply: z.boolean().optional().nullable(),
  endTime: z.string().optional().nullable(),
  responseBodyHtml: z.string().optional().nullable(),
  responseBodyPlainText: z.string().optional().nullable(),
  responseSubject: z.string().optional().nullable(),
  restrictToContacts: z.boolean().optional().nullable(),
  restrictToDomain: z.boolean().optional().nullable(),
  startTime: z.string().optional().nullable(),
})
var gmailV1SchemaWatchRequestSchema = z.object({
  labelFilterAction: z.string().optional().nullable(),
  labelIds: z.array(z.string()).optional().nullable(),
  topicName: z.string().optional().nullable(),
})
var gmailV1SchemaWatchResponseSchema = z.object({
  expiration: z.string().optional().nullable(),
  historyId: z.string().optional().nullable(),
})
var gmailV1SchemaFilterSchema = z.object({
  action: gmailV1SchemaFilterActionSchema.optional(),
  criteria: gmailV1SchemaFilterCriteriaSchema.optional(),
  id: z.string().optional().nullable(),
})
var gmailV1SchemaLabelSchema = z.object({
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
var gmailV1SchemaListFiltersResponseSchema = z.object({
  filter: z.array(gmailV1SchemaFilterSchema).optional(),
})
var gmailV1SchemaListLabelsResponseSchema = z.object({
  labels: z.array(gmailV1SchemaLabelSchema).optional(),
})
var gmailV1SchemaListSmimeInfoResponseSchema = z.object({
  smimeInfo: z.array(gmailV1SchemaSmimeInfoSchema).optional(),
})
var gmailV1SchemaMessagePartSchema = z.lazy(() =>
  z.object({
    body: gmailV1SchemaMessagePartBodySchema.optional(),
    filename: z.string().optional().nullable(),
    headers: z.array(gmailV1SchemaMessagePartHeaderSchema).optional(),
    mimeType: z.string().optional().nullable(),
    partId: z.string().optional().nullable(),
    parts: z.array(gmailV1SchemaMessagePartSchema).optional(),
  })
)
var gmailV1SchemaSendAsSchema = z.object({
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
var gmailV1SchemaListSendAsResponseSchema = z.object({
  sendAs: z.array(gmailV1SchemaSendAsSchema).optional(),
})
var gmailV1SchemaMessageSchema = z.object({
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
var gmailV1SchemaThreadSchema = z.object({
  historyId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  snippet: z.string().optional().nullable(),
})
var gmailV1SchemaDraftSchema = z.object({
  id: z.string().optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})
var gmailV1SchemaHistoryLabelAddedSchema = z.object({
  labelIds: z.array(z.string()).optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})
var gmailV1SchemaHistoryLabelRemovedSchema = z.object({
  labelIds: z.array(z.string()).optional().nullable(),
  message: gmailV1SchemaMessageSchema.optional(),
})
var gmailV1SchemaHistoryMessageAddedSchema = z.object({
  message: gmailV1SchemaMessageSchema.optional(),
})
var gmailV1SchemaHistoryMessageDeletedSchema = z.object({
  message: gmailV1SchemaMessageSchema.optional(),
})
var gmailV1SchemaListDraftsResponseSchema = z.object({
  drafts: z.array(gmailV1SchemaDraftSchema).optional(),
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
})
var gmailV1SchemaListMessagesResponseSchema = z.object({
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
})
var gmailV1SchemaListThreadsResponseSchema = z.object({
  nextPageToken: z.string().optional().nullable(),
  resultSizeEstimate: z.number().optional().nullable(),
  threads: z.array(gmailV1SchemaThreadSchema).optional(),
})
var gmailV1SchemaHistorySchema = z.object({
  id: z.string().optional().nullable(),
  labelsAdded: z.array(gmailV1SchemaHistoryLabelAddedSchema).optional(),
  labelsRemoved: z.array(gmailV1SchemaHistoryLabelRemovedSchema).optional(),
  messages: z.array(gmailV1SchemaMessageSchema).optional(),
  messagesAdded: z.array(gmailV1SchemaHistoryMessageAddedSchema).optional(),
  messagesDeleted: z.array(gmailV1SchemaHistoryMessageDeletedSchema).optional(),
})
var gmailV1SchemaListHistoryResponseSchema = z.object({
  history: z.array(gmailV1SchemaHistorySchema).optional(),
  historyId: z.string().optional().nullable(),
  nextPageToken: z.string().optional().nullable(),
})

// src/types/peopleTypes.ts
import { z as z2 } from './node_modules/zod/lib/index.mjs'
var peopleV1SchemaBatchDeleteContactsRequestSchema = z2.object({
  resourceNames: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaContactGroupMembershipSchema = z2.object({
  contactGroupId: z2.string().optional().nullable(),
  contactGroupResourceName: z2.string().optional().nullable(),
})
var peopleV1SchemaContactGroupMetadataSchema = z2.object({
  deleted: z2.boolean().optional().nullable(),
  updateTime: z2.string().optional().nullable(),
})
var peopleV1SchemaCopyOtherContactToMyContactsGroupRequestSchema = z2.object({
  copyMask: z2.string().optional().nullable(),
  readMask: z2.string().optional().nullable(),
  sources: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaDateSchema = z2.object({
  day: z2.number().optional().nullable(),
  month: z2.number().optional().nullable(),
  year: z2.number().optional().nullable(),
})
var peopleV1SchemaDomainMembershipSchema = z2.object({
  inViewerDomain: z2.boolean().optional().nullable(),
})
var peopleV1SchemaEmptySchema = z2.object({})
var peopleV1SchemaGroupClientDataSchema = z2.object({
  key: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaModifyContactGroupMembersRequestSchema = z2.object({
  resourceNamesToAdd: z2.array(z2.string()).optional().nullable(),
  resourceNamesToRemove: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaModifyContactGroupMembersResponseSchema = z2.object({
  canNotRemoveLastContactGroupResourceNames: z2
    .array(z2.string())
    .optional()
    .nullable(),
  notFoundResourceNames: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaProfileMetadataSchema = z2.object({
  objectType: z2.string().optional().nullable(),
  userTypes: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaSourceSchema = z2.object({
  etag: z2.string().optional().nullable(),
  id: z2.string().optional().nullable(),
  profileMetadata: peopleV1SchemaProfileMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  updateTime: z2.string().optional().nullable(),
})
var peopleV1SchemaStatusSchema = z2.object({
  code: z2.number().optional().nullable(),
  details: z2.array(z2.record(z2.any())).optional().nullable(),
  message: z2.string().optional().nullable(),
})
var peopleV1SchemaUpdateContactPhotoRequestSchema = z2.object({
  personFields: z2.string().optional().nullable(),
  photoBytes: z2.string().optional().nullable(),
  sources: z2.array(z2.string()).optional().nullable(),
})
var peopleV1SchemaContactGroupSchema = z2.object({
  clientData: z2.array(peopleV1SchemaGroupClientDataSchema).optional(),
  etag: z2.string().optional().nullable(),
  formattedName: z2.string().optional().nullable(),
  groupType: z2.string().optional().nullable(),
  memberCount: z2.number().optional().nullable(),
  memberResourceNames: z2.array(z2.string()).optional().nullable(),
  metadata: peopleV1SchemaContactGroupMetadataSchema.optional(),
  name: z2.string().optional().nullable(),
  resourceName: z2.string().optional().nullable(),
})
var peopleV1SchemaContactGroupResponseSchema = z2.object({
  contactGroup: peopleV1SchemaContactGroupSchema.optional(),
  requestedResourceName: z2.string().optional().nullable(),
  status: peopleV1SchemaStatusSchema.optional(),
})
var peopleV1SchemaCreateContactGroupRequestSchema = z2.object({
  contactGroup: peopleV1SchemaContactGroupSchema.optional(),
  readGroupFields: z2.string().optional().nullable(),
})
var peopleV1SchemaFieldMetadataSchema = z2.object({
  primary: z2.boolean().optional().nullable(),
  source: peopleV1SchemaSourceSchema.optional(),
  sourcePrimary: z2.boolean().optional().nullable(),
  verified: z2.boolean().optional().nullable(),
})
var peopleV1SchemaFileAsSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaGenderSchema = z2.object({
  addressMeAs: z2.string().optional().nullable(),
  formattedValue: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaImClientSchema = z2.object({
  formattedProtocol: z2.string().optional().nullable(),
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  protocol: z2.string().optional().nullable(),
  type: z2.string().optional().nullable(),
  username: z2.string().optional().nullable(),
})
var peopleV1SchemaInterestSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaListContactGroupsResponseSchema = z2.object({
  contactGroups: z2.array(peopleV1SchemaContactGroupSchema).optional(),
  nextPageToken: z2.string().optional().nullable(),
  nextSyncToken: z2.string().optional().nullable(),
  totalItems: z2.number().optional().nullable(),
})
var peopleV1SchemaLocaleSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaLocationSchema = z2.object({
  buildingId: z2.string().optional().nullable(),
  current: z2.boolean().optional().nullable(),
  deskCode: z2.string().optional().nullable(),
  floor: z2.string().optional().nullable(),
  floorSection: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaMembershipSchema = z2.object({
  contactGroupMembership: peopleV1SchemaContactGroupMembershipSchema.optional(),
  domainMembership: peopleV1SchemaDomainMembershipSchema.optional(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
})
var peopleV1SchemaMiscKeywordSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaNameSchema = z2.object({
  displayName: z2.string().optional().nullable(),
  displayNameLastFirst: z2.string().optional().nullable(),
  familyName: z2.string().optional().nullable(),
  givenName: z2.string().optional().nullable(),
  honorificPrefix: z2.string().optional().nullable(),
  honorificSuffix: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  middleName: z2.string().optional().nullable(),
  phoneticFamilyName: z2.string().optional().nullable(),
  phoneticFullName: z2.string().optional().nullable(),
  phoneticGivenName: z2.string().optional().nullable(),
  phoneticHonorificPrefix: z2.string().optional().nullable(),
  phoneticHonorificSuffix: z2.string().optional().nullable(),
  phoneticMiddleName: z2.string().optional().nullable(),
  unstructuredName: z2.string().optional().nullable(),
})
var peopleV1SchemaNicknameSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaOccupationSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaOrganizationSchema = z2.object({
  costCenter: z2.string().optional().nullable(),
  current: z2.boolean().optional().nullable(),
  department: z2.string().optional().nullable(),
  domain: z2.string().optional().nullable(),
  endDate: peopleV1SchemaDateSchema.optional(),
  formattedType: z2.string().optional().nullable(),
  fullTimeEquivalentMillipercent: z2.number().optional().nullable(),
  jobDescription: z2.string().optional().nullable(),
  location: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  name: z2.string().optional().nullable(),
  phoneticName: z2.string().optional().nullable(),
  startDate: peopleV1SchemaDateSchema.optional(),
  symbol: z2.string().optional().nullable(),
  title: z2.string().optional().nullable(),
  type: z2.string().optional().nullable(),
})
var peopleV1SchemaPersonMetadataSchema = z2.object({
  deleted: z2.boolean().optional().nullable(),
  linkedPeopleResourceNames: z2.array(z2.string()).optional().nullable(),
  objectType: z2.string().optional().nullable(),
  previousResourceNames: z2.array(z2.string()).optional().nullable(),
  sources: z2.array(peopleV1SchemaSourceSchema).optional(),
})
var peopleV1SchemaPhoneNumberSchema = z2.object({
  canonicalForm: z2.string().optional().nullable(),
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaPhotoSchema = z2.object({
  default: z2.boolean().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  url: z2.string().optional().nullable(),
})
var peopleV1SchemaRelationSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  person: z2.string().optional().nullable(),
  type: z2.string().optional().nullable(),
})
var peopleV1SchemaRelationshipInterestSchema = z2.object({
  formattedValue: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaRelationshipStatusSchema = z2.object({
  formattedValue: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaResidenceSchema = z2.object({
  current: z2.boolean().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaSipAddressSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaSkillSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaTaglineSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaUpdateContactGroupRequestSchema = z2.object({
  contactGroup: peopleV1SchemaContactGroupSchema.optional(),
  readGroupFields: z2.string().optional().nullable(),
  updateGroupFields: z2.string().optional().nullable(),
})
var peopleV1SchemaUrlSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaUserDefinedSchema = z2.object({
  key: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaAddressSchema = z2.object({
  city: z2.string().optional().nullable(),
  country: z2.string().optional().nullable(),
  countryCode: z2.string().optional().nullable(),
  extendedAddress: z2.string().optional().nullable(),
  formattedType: z2.string().optional().nullable(),
  formattedValue: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  poBox: z2.string().optional().nullable(),
  postalCode: z2.string().optional().nullable(),
  region: z2.string().optional().nullable(),
  streetAddress: z2.string().optional().nullable(),
  type: z2.string().optional().nullable(),
})
var peopleV1SchemaAgeRangeTypeSchema = z2.object({
  ageRange: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
})
var peopleV1SchemaBatchGetContactGroupsResponseSchema = z2.object({
  responses: z2.array(peopleV1SchemaContactGroupResponseSchema).optional(),
})
var peopleV1SchemaBiographySchema = z2.object({
  contentType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaBirthdaySchema = z2.object({
  date: peopleV1SchemaDateSchema.optional(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  text: z2.string().optional().nullable(),
})
var peopleV1SchemaBraggingRightsSchema = z2.object({
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaCalendarUrlSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  url: z2.string().optional().nullable(),
})
var peopleV1SchemaClientDataSchema = z2.object({
  key: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaCoverPhotoSchema = z2.object({
  default: z2.boolean().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  url: z2.string().optional().nullable(),
})
var peopleV1SchemaEmailAddressSchema = z2.object({
  displayName: z2.string().optional().nullable(),
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaEventSchema = z2.object({
  date: peopleV1SchemaDateSchema.optional(),
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
})
var peopleV1SchemaExternalIdSchema = z2.object({
  formattedType: z2.string().optional().nullable(),
  metadata: peopleV1SchemaFieldMetadataSchema.optional(),
  type: z2.string().optional().nullable(),
  value: z2.string().optional().nullable(),
})
var peopleV1SchemaPersonSchema = z2.object({
  addresses: z2.array(peopleV1SchemaAddressSchema).optional(),
  ageRange: z2.string().optional().nullable(),
  ageRanges: z2.array(peopleV1SchemaAgeRangeTypeSchema).optional(),
  biographies: z2.array(peopleV1SchemaBiographySchema).optional(),
  birthdays: z2.array(peopleV1SchemaBirthdaySchema).optional(),
  braggingRights: z2.array(peopleV1SchemaBraggingRightsSchema).optional(),
  calendarUrls: z2.array(peopleV1SchemaCalendarUrlSchema).optional(),
  clientData: z2.array(peopleV1SchemaClientDataSchema).optional(),
  coverPhotos: z2.array(peopleV1SchemaCoverPhotoSchema).optional(),
  emailAddresses: z2.array(peopleV1SchemaEmailAddressSchema).optional(),
  etag: z2.string().optional().nullable(),
  events: z2.array(peopleV1SchemaEventSchema).optional(),
  externalIds: z2.array(peopleV1SchemaExternalIdSchema).optional(),
  fileAses: z2.array(peopleV1SchemaFileAsSchema).optional(),
  genders: z2.array(peopleV1SchemaGenderSchema).optional(),
  imClients: z2.array(peopleV1SchemaImClientSchema).optional(),
  interests: z2.array(peopleV1SchemaInterestSchema).optional(),
  locales: z2.array(peopleV1SchemaLocaleSchema).optional(),
  locations: z2.array(peopleV1SchemaLocationSchema).optional(),
  memberships: z2.array(peopleV1SchemaMembershipSchema).optional(),
  metadata: peopleV1SchemaPersonMetadataSchema.optional(),
  miscKeywords: z2.array(peopleV1SchemaMiscKeywordSchema).optional(),
  names: z2.array(peopleV1SchemaNameSchema).optional(),
  nicknames: z2.array(peopleV1SchemaNicknameSchema).optional(),
  occupations: z2.array(peopleV1SchemaOccupationSchema).optional(),
  organizations: z2.array(peopleV1SchemaOrganizationSchema).optional(),
  phoneNumbers: z2.array(peopleV1SchemaPhoneNumberSchema).optional(),
  photos: z2.array(peopleV1SchemaPhotoSchema).optional(),
  relations: z2.array(peopleV1SchemaRelationSchema).optional(),
  relationshipInterests: z2
    .array(peopleV1SchemaRelationshipInterestSchema)
    .optional(),
  relationshipStatuses: z2
    .array(peopleV1SchemaRelationshipStatusSchema)
    .optional(),
  residences: z2.array(peopleV1SchemaResidenceSchema).optional(),
  resourceName: z2.string().optional().nullable(),
  sipAddresses: z2.array(peopleV1SchemaSipAddressSchema).optional(),
  skills: z2.array(peopleV1SchemaSkillSchema).optional(),
  taglines: z2.array(peopleV1SchemaTaglineSchema).optional(),
  urls: z2.array(peopleV1SchemaUrlSchema).optional(),
  userDefined: z2.array(peopleV1SchemaUserDefinedSchema).optional(),
})
var peopleV1SchemaPersonResponseSchema = z2.object({
  httpStatusCode: z2.number().optional().nullable(),
  person: peopleV1SchemaPersonSchema.optional(),
  requestedResourceName: z2.string().optional().nullable(),
  status: peopleV1SchemaStatusSchema.optional(),
})
var peopleV1SchemaSearchDirectoryPeopleResponseSchema = z2.object({
  nextPageToken: z2.string().optional().nullable(),
  people: z2.array(peopleV1SchemaPersonSchema).optional(),
  totalSize: z2.number().optional().nullable(),
})
var peopleV1SchemaSearchResultSchema = z2.object({
  person: peopleV1SchemaPersonSchema.optional(),
})
var peopleV1SchemaUpdateContactPhotoResponseSchema = z2.object({
  person: peopleV1SchemaPersonSchema.optional(),
})
var peopleV1SchemaBatchCreateContactsResponseSchema = z2.object({
  createdPeople: z2.array(peopleV1SchemaPersonResponseSchema).optional(),
})
var peopleV1SchemaBatchUpdateContactsRequestSchema = z2.object({
  contacts: z2.record(peopleV1SchemaPersonSchema).optional().nullable(),
  readMask: z2.string().optional().nullable(),
  sources: z2.array(z2.string()).optional().nullable(),
  updateMask: z2.string().optional().nullable(),
})
var peopleV1SchemaBatchUpdateContactsResponseSchema = z2.object({
  updateResult: z2
    .record(peopleV1SchemaPersonResponseSchema)
    .optional()
    .nullable(),
})
var peopleV1SchemaContactToCreateSchema = z2.object({
  contactPerson: peopleV1SchemaPersonSchema.optional(),
})
var peopleV1SchemaDeleteContactPhotoResponseSchema = z2.object({
  person: peopleV1SchemaPersonSchema.optional(),
})
var peopleV1SchemaGetPeopleResponseSchema = z2.object({
  responses: z2.array(peopleV1SchemaPersonResponseSchema).optional(),
})
var peopleV1SchemaListConnectionsResponseSchema = z2.object({
  connections: z2.array(peopleV1SchemaPersonSchema).optional(),
  nextPageToken: z2.string().optional().nullable(),
  nextSyncToken: z2.string().optional().nullable(),
  totalItems: z2.number().optional().nullable(),
  totalPeople: z2.number().optional().nullable(),
})
var peopleV1SchemaListDirectoryPeopleResponseSchema = z2.object({
  nextPageToken: z2.string().optional().nullable(),
  nextSyncToken: z2.string().optional().nullable(),
  people: z2.array(peopleV1SchemaPersonSchema).optional(),
})
var peopleV1SchemaListOtherContactsResponseSchema = z2.object({
  nextPageToken: z2.string().optional().nullable(),
  nextSyncToken: z2.string().optional().nullable(),
  otherContacts: z2.array(peopleV1SchemaPersonSchema).optional(),
  totalSize: z2.number().optional().nullable(),
})
var peopleV1SchemaSearchResponseSchema = z2.object({
  results: z2.array(peopleV1SchemaSearchResultSchema).optional(),
})
var peopleV1SchemaBatchCreateContactsRequestSchema = z2.object({
  contacts: z2.array(peopleV1SchemaContactToCreateSchema).optional(),
  readMask: z2.string().optional().nullable(),
  sources: z2.array(z2.string()).optional().nullable(),
})

// src/types/otherTypes.ts
var getAuthUrlResponseSchema = z3.string()
var getAuthenticateClient = z3.union
var credentialsSchema = z3.object({
  refresh_token: z3.string().optional().nullable(),
  expiry_date: z3.number().optional().nullable(),
  access_token: z3.string().optional().nullable(),
  token_type: z3.string().optional().nullable(),
  id_token: z3.string().optional().nullable(),
  scope: z3.string().optional(),
})
var credentialRequestSchema = z3.object({
  refresh_token: z3.string().optional(),
  access_token: z3.string().optional(),
  token_type: z3.string().optional(),
  expires_in: z3.number().optional(),
  id_token: z3.string().optional(),
  scope: z3.string().optional(),
})
var jWTInputSchema = z3.object({
  type: z3.string().optional(),
  client_email: z3.string().optional(),
  private_key: z3.string().optional(),
  private_key_id: z3.string().optional(),
  project_id: z3.string().optional(),
  client_id: z3.string().optional(),
  client_secret: z3.string().optional(),
  refresh_token: z3.string().optional(),
  quota_project_id: z3.string().optional(),
})
var credentialBodySchema = z3.object({
  client_email: z3.string().optional(),
  private_key: z3.string().optional(),
})
var extendedGmailV1SchemaProfileSchemaSchema = gmailV1SchemaProfileSchema.and(
  peopleV1SchemaNameSchema.pick({ displayName: true })
)
var userSettingsSchemaBase = z3.object({
  alternateActions: z3.boolean(),
  isAvatarVisible: z3.boolean(),
  isFlexibleFlowActive: z3.boolean(),
  showIntroduction: z3.boolean(),
})
var userSettingsSchemaNumericalSizes = userSettingsSchemaBase.extend({
  emailFetchSize: z3.union([z3.literal(20), z3.literal(25), z3.literal(30)]),
})
var userSettingsSchemaStringSizes = userSettingsSchemaBase.extend({
  emailFetchSize: z3.union([
    z3.literal('20'),
    z3.literal('25'),
    z3.literal('30'),
  ]),
})

// src/utils/errorHandeling.ts
function errorHandeling(err, functionName) {
  if (err.response) {
    const error2 = err
    if ('response' in error2) {
      console.error(error2.response)
    }
    throw error2
  }
  const errorMessage = `${functionName} returned an error: ${err}`
  const error = new Error(errorMessage)
  error.status = 500
  const errorObject = {
    status: error.status,
    message: error.message,
  }
  throw { error: errorObject, originalError: err }
}

// src/utils/settingsLabel/settingsConstants.ts
var SETTINGS_LABEL = 'Juno/'
var SETTINGS_DELIMITER = '#'
var AVAILABLE_SETTINGS = [
  'isAvatarVisible',
  'emailFetchSize',
  'isFlexibleFlowActive',
  'showIntroduction',
  'alternateActions',
]
var showAvatarMap = {
  SA0: false,
  SA1: true,
}
var showAvatarKeyMap = {
  false: 'SA0',
  true: 'SA1',
}
var emailFetchSizeMap = {
  FS20: 20,
  FS25: 25,
  FS30: 30,
}
var emailFetchSizeKeyMap = {
  20: 'FS20',
  25: 'FS25',
  30: 'FS30',
}
var flexibleFlowMap = {
  FF0: false,
  FF1: true,
}
var flexibleFlowKeyMap = {
  false: 'FF0',
  true: 'FF1',
}
var showIntroductionMap = {
  SI0: false,
  SI1: true,
}
var showIntroductionKeyMap = {
  false: 'SI0',
  true: 'SI1',
}
var alternateActionsMap = {
  AA0: false,
  AA1: true,
}
var alternateActionsKeyMap = {
  false: 'AA0',
  true: 'AA1',
}

// src/utils/settingsLabel/buildLabelString.ts
var buildLabelString = (input) => {
  let newString = `${SETTINGS_LABEL}`
  const settingFunctions = {
    isAvatarVisible: (value) => {
      if (showAvatarKeyMap[value]) {
        newString += `${SETTINGS_DELIMITER + showAvatarKeyMap[value]}`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    showIntroduction: (value) => {
      if (showIntroductionKeyMap[value]) {
        newString += `${SETTINGS_DELIMITER + showIntroductionKeyMap[value]}`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    isFlexibleFlowActive: (value) => {
      if (flexibleFlowKeyMap[value]) {
        newString += `${SETTINGS_DELIMITER + flexibleFlowKeyMap[value]}`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    alternateActions: (value) => {
      if (alternateActionsKeyMap[value]) {
        newString += `${SETTINGS_DELIMITER + alternateActionsKeyMap[value]}`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    emailFetchSize: (value) => {
      if (emailFetchSizeKeyMap[value]) {
        newString += `${SETTINGS_DELIMITER + emailFetchSizeKeyMap[value]}`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
  }
  for (const [key, value] of Object.entries(input)) {
    if (settingFunctions[key]) {
      settingFunctions[key](value)
    }
  }
  return newString
}

// src/api/Labels/createLabel.ts
import { google } from './node_modules/googleapis/build/src/index.js'

// src/google/index.ts
import { randomUUID } from 'crypto'
import { OAuth2Client } from './node_modules/google-auth-library/build/src/index.js'

// src/utils/createHashedState.ts
import { createHash } from 'crypto'
function createHashState(secret) {
  const hashValue = createHash('sha256').update(secret).digest('hex')
  return hashValue
}

// src/google/index.ts
var SCOPES = [
  'email',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
  'openid',
  'profile',
]
var createAuthClientObject = (req) => {
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(
    process.env.GOOGLE_REDIRECT_URL,
    'No Google Redirect URL found'
  )
  function determineAuthURLStructure() {
    if (process.env.NODE_ENV === 'production') {
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req?.headers?.referer
      ) {
        return req.headers.referer.endsWith('/')
          ? req.headers.referer.slice(0, -1)
          : req.headers.referer
      }
      return process.env.FRONTEND_URL
    }
    return process.env.FRONTEND_URL
  }
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${determineAuthURLStructure()}${process.env.GOOGLE_REDIRECT_URL}`
  )
}
var getAuthenticateClient2 = async (req, res) => {
  try {
    const { code, state } = req.body
    if (!code) {
      res.status(400).json('Code not found')
      throw new Error('Code not found')
    }
    const oAuth2Client = createAuthClientObject(req)
    const { tokens } = await oAuth2Client.getToken(code)
    if (state && state !== 'noSession') {
      try {
        if (
          req.session?.hashSecret &&
          createHashState(req.session.hashSecret) === state
        ) {
          if (
            tokens &&
            tokens?.id_token &&
            (await checkIdValidity(tokens.id_token))
          ) {
            oAuth2Client.setCredentials(tokens)
            req.session.oAuthClient = tokens
            loggerMiddleware_default.info(
              'Successfully set credentials on OAuth2Client and session'
            )
          } else {
            loggerMiddleware_default.warn(
              'Invalid token during client authentication'
            )
            return res.status(401).json(global.INVALID_TOKEN)
          }
        } else {
          loggerMiddleware_default.error(
            'Invalid state detected during client authentication'
          )
          res.status(401).json('Invalid state detected')
          throw new Error('Invalid state detected')
        }
      } catch (err) {
        loggerMiddleware_default.error(
          `Error during state and token check: ${err}`
        )
        throw err
      }
    }
    if (state === 'noSession') {
      if (tokens) {
        oAuth2Client.setCredentials(tokens)
        const result = {
          credentials: oAuth2Client.credentials,
        }
        credentialsSchema.parse(result.credentials)
        return res.status(200).json({
          credentials: oAuth2Client.credentials,
        })
      } else {
        const errorMessage = 'Token not found'
        loggerMiddleware_default.error(errorMessage)
        return res.status(401).json(errorMessage)
      }
    }
    return res.status(200).json({
      idToken: `"${randomUUID()}"`,
    })
  } catch (err) {
    loggerMiddleware_default.error(
      `Error in getAuthenticateClient function: ${err}`
    )
    res.status(401).json(err.message)
  }
}
var getAuthUrl = async (req, res) => {
  try {
    const oAuth2Client = createAuthClientObject(req)
    const randomID = randomUUID()
    const hashState = createHashState(randomID)
    req.session.hashSecret = randomID
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      // Use 'select_account' to ensure that the user is always using the wanted user.
      prompt: 'select_account',
      scope: SCOPES,
      // Use a SHA256 state for security reasons when the cloud version is used.
      state: req?.body?.noSession ? 'noSession' : hashState,
      // code_challenge_method: S256,
      // code_challenge: createHash('sha256').digest('hex'),
    })
    getAuthUrlResponseSchema.parse(authorizeUrl)
    return res.status(200).json(authorizeUrl)
  } catch (err) {
    res.status(401).json(err)
  }
}
var checkIdValidity = async (token) => {
  const oAuth2Client = createAuthClientObject(null)
  try {
    await oAuth2Client.verifyIdToken({
      idToken: token.replace(/['"]+/g, ''),
    })
    return true
  } catch (err) {
    console.log('google err', err)
    return false
  }
}

// src/google/localRoute.ts
var authorizeLocal = async ({ credentials }) => {
  if (!credentials) {
    loggerMiddleware_default.error('Credentials not provided')
    return INVALID_TOKEN
  }
  const oAuth2Client = createAuthClientObject(null)
  try {
    oAuth2Client.setCredentials(credentials)
    const checkedAccessToken = await oAuth2Client.getAccessToken()
    if (!checkedAccessToken) {
      loggerMiddleware_default.error('Cannot refresh the access token')
      return INVALID_TOKEN
    }
    return oAuth2Client
  } catch (err) {
    loggerMiddleware_default.error('Error during authorization', { error: err })
    return 'Error during authorization'
  }
}
var authenticateLocal = async ({ credentials }) => {
  try {
    if (!credentials) {
      loggerMiddleware_default.error('Credentials not provided')
      return INVALID_TOKEN
    }
    const response = await authorizeLocal({ credentials })
    return response
  } catch (err) {
    loggerMiddleware_default.error('Error during local authentication', {
      error: err,
    })
  }
}

// src/google/sessionRoute.ts
var authorizeSession = async ({ req }) => {
  const oAuth2Client = createAuthClientObject(null)
  try {
    if (req.session.oAuthClient) {
      oAuth2Client.setCredentials(req.session.oAuthClient)
      const checkedAccessToken = await oAuth2Client.getAccessToken()
      if (!checkedAccessToken) {
        loggerMiddleware_default.error('Cannot refresh the access token')
        console.error('Cannot refresh the access token')
        return INVALID_TOKEN
      }
      req.session.oAuthClient = oAuth2Client.credentials
      return oAuth2Client
    }
  } catch (err) {
    loggerMiddleware_default.error(`Error during authorization: ${err}`)
    console.log('err', err)
    return 'Error during authorization'
  }
}
var authenticateSession = async ({ req }) => {
  try {
    if (typeof req.session?.oAuthClient !== 'undefined') {
      const response = await authorizeSession({ req })
      if (response === INVALID_TOKEN) {
        loggerMiddleware_default.warn(
          'Session token found to be invalid during authentication'
        )
      }
      return response
    } else {
      loggerMiddleware_default.warn(
        'Invalid session found during authentication'
      )
    }
    return INVALID_SESSION
  } catch (err) {
    loggerMiddleware_default.error(`Error on authenticateSession: ${err}`)
  }
}

// src/api/Users/authenticateUser.ts
var authenticateUserSession = async (req) => {
  const response = await authenticateSession({
    req,
  })
  if (response === INVALID_TOKEN) {
    throw Error(response)
  }
  if (response === INVALID_SESSION) {
    throw Error(response)
  }
  if (response === 'Error during authorization') {
    throw Error(response)
  }
  return response
}
var authenticateUserLocal = async (req) => {
  if (req.headers?.authorization) {
    const response = await authenticateLocal({
      credentials: JSON.parse(req.headers.authorization),
    })
    if (response === INVALID_TOKEN) {
      throw Error(response)
    }
    if (response === 'Error during authorization') {
      throw Error(response)
    }
    return response
  }
  throw Error('No Authorization header found')
}

// src/middleware/authMiddleware.ts
var authMiddleware = (requestFunction) => async (req) => {
  try {
    if (req.headers?.authorization) {
      const useLocalRoute =
        typeof JSON.parse(req.headers.authorization) === 'object'
      const auth = useLocalRoute
        ? await authenticateUserLocal(req)
        : await authenticateUserSession(req)
      const response = await requestFunction(auth, req)
      if (response instanceof Error) {
        return { success: false, data: response, statusCode: 400 }
      }
      return { success: true, data: response, statusCode: 200 }
    }
    return {
      success: false,
      data: 'There is no authorization header found',
      statusCode: 401,
    }
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.error(err)
    return {
      statusCode: 401,
      success: false,
      error: err,
      data: err?.message || 'Internal server error',
    }
  }
}

// src/middleware/responseMiddleware.ts
var responseMiddleware = (res, statusCode, message) => {
  return res.status(statusCode).json(message)
}

// src/api/Labels/createLabel.ts
var newLabel = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const {
      body: { labelListVisibility, messageListVisibility, name },
    } = req
    const response = await gmail.users.labels.create({
      userId: USER,
      requestBody: {
        labelListVisibility,
        messageListVisibility,
        name,
      },
    })
    const validatedResponse = gmailV1SchemaLabelSchema.parse(response.data)
    return validatedResponse
  } catch (err) {
    console.error(err)
    errorHandeling(err, 'createLabel')
  }
}
var createLabel = async (req, res) => {
  const { data, statusCode } = await authMiddleware(newLabel)(req)
  responseMiddleware(res, statusCode, data)
}

// src/utils/settingsLabel/createSettings.ts
async function createSettingsLabel(auth, presetValues) {
  if (presetValues) {
    const presetValueBody = { body: { name: buildLabelString(presetValues) } }
    const response2 = await newLabel(auth, presetValueBody)
    return response2
  }
  const defaultSettingsString = `${
    SETTINGS_LABEL +
    SETTINGS_DELIMITER +
    showAvatarKeyMap.true +
    SETTINGS_DELIMITER +
    emailFetchSizeKeyMap[20] +
    SETTINGS_DELIMITER +
    showIntroductionKeyMap.true +
    SETTINGS_DELIMITER +
    flexibleFlowKeyMap.false +
    SETTINGS_DELIMITER +
    alternateActionsKeyMap.true
  }`
  const newLabelBody = { body: { name: defaultSettingsString } }
  const response = await newLabel(auth, newLabelBody)
  return response
}

// src/api/Labels/removeLabel.ts
import { google as google2 } from './node_modules/googleapis/build/src/index.js'
var deleteLabel = async (auth, req) => {
  const gmail = google2.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req
  try {
    const response = await gmail.users.labels.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'removeLabels')
  }
}
var removeLabel = async (req, res) => {
  const { data, statusCode } = await authMiddleware(deleteLabel)(req)
  responseMiddleware(res, statusCode, data)
}

// src/utils/settingsLabel/findSettings.ts
var findSettings = (labels, auth) => {
  const result = labels.filter((label) =>
    label.name?.includes(`${SETTINGS_LABEL + SETTINGS_DELIMITER}`)
  )
  if (!result.length) {
    return null
  }
  if (result.length === 1) {
    return result[0]
  }
  const longestSettingsLabel = result.reduce(
    (acc, curr) => {
      if (
        (curr?.name && acc?.name && curr.name.length > acc.name.length) ||
        !acc.name
      ) {
        return curr
      }
      return acc
    },
    { name: '', id: '', type: '' }
  )
  result
    .filter((label) => label !== longestSettingsLabel)
    .forEach((label) => {
      if (label && label?.id) {
        void deleteLabel(auth, { body: { id: label.id } })
      }
    })
  return longestSettingsLabel
}
var findSettings_default = findSettings

// src/utils/settingsLabel/fixMissingSettings.ts
var settingMap = {
  isAvatarVisible: showAvatarMap.SA1,
  emailFetchSize: emailFetchSizeMap.FS20,
  isFlexibleFlowActive: flexibleFlowMap.FF1,
  showIntroduction: showIntroductionMap.SI1,
  alternateActions: alternateActionsMap.AA1,
}
function fixMissingSetting(missingSettings) {
  const fixedSettings = {}
  const unableToHandle = []
  for (const value of missingSettings) {
    if (settingMap[value]) {
      fixedSettings[value] = settingMap[value]
    } else {
      unableToHandle.push(value)
    }
  }
  if (unableToHandle.length > 0) {
    console.error(unableToHandle)
  }
  return fixedSettings
}

// src/utils/settingsLabel/parseSettings.ts
function parseSettings(settingsLabel) {
  const parsedSettings = settingsLabel.name?.split(SETTINGS_DELIMITER)
  if (parsedSettings && parsedSettings.length > 0) {
    parsedSettings.shift()
    const baseSettings = AVAILABLE_SETTINGS
    const foundSettings = {}
    for (const value of Object.values(parsedSettings)) {
      switch (value) {
        case 'SA0':
        case 'SA1':
          foundSettings.isAvatarVisible = showAvatarMap[value]
          baseSettings.filter((item) => item !== 'avatar')
          break
        case 'FS20':
        case 'FS25':
        case 'FS30':
          foundSettings.emailFetchSize = emailFetchSizeMap[value]
          break
        case 'FF0':
        case 'FF1':
          foundSettings.isFlexibleFlowActive = flexibleFlowMap[value]
          break
        case 'SI0':
        case 'SI1':
          foundSettings.showIntroduction = showIntroductionMap[value]
          break
        case 'AA0':
        case 'AA1':
          foundSettings.alternateActions = alternateActionsMap[value]
          break
        default:
          break
      }
    }
    const missingSettings = baseSettings.filter(
      (item) => !Object.keys(foundSettings).includes(item)
    )
    if (missingSettings.length > 0) {
      const fixedResult = fixMissingSetting(missingSettings)
      const completeSettings = Object.assign(foundSettings, fixedResult)
      void createSettingsLabel(completeSettings)
      return completeSettings
    }
    return foundSettings
  }
}

// src/api/Labels/getLabels.ts
import { google as google3 } from './node_modules/googleapis/build/src/index.js'
var fetchLabels = async (auth) => {
  const gmail = google3.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.labels.list({
      userId: USER,
    })
    if (response?.data) {
      gmailV1SchemaListLabelsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No Labels found...')
  } catch (err) {
    errorHandeling(err, 'getLabels')
  }
}
var getLabels = async (req, res) => {
  const { data, statusCode } = await authMiddleware(fetchLabels)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Users/fetchSendAs.ts
import { google as google4 } from './node_modules/googleapis/build/src/index.js'
var fetchSendAs = async (auth, req) => {
  const gmail = google4.gmail({ version: 'v1', auth })
  let emailId = ''
  if (typeof req === 'string') {
    emailId = req
  } else {
    emailId = req.query.emailId
  }
  if (typeof emailId === 'string') {
    try {
      const response = await gmail.users.settings.sendAs.get({
        userId: USER,
        sendAsEmail: emailId,
      })
      if (response?.data) {
        gmailV1SchemaSendAsSchema.parse(response.data)
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      errorHandeling(err, 'getSendAs')
    }
  } else {
    throw Error('Invalid email id request')
  }
}

// src/api/Users/getProfile.ts
import { google as google5 } from './node_modules/googleapis/build/src/index.js'
var fetchProfile = async (auth) => {
  const gmail = google5.gmail({ version: 'v1', auth })
  const people = google5.people({ version: 'v1', auth })
  try {
    const [userResponse, contactsResponse] = await Promise.allSettled([
      gmail.users.getProfile({
        userId: USER,
      }),
      people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
      }),
    ])
    if (
      userResponse.status === 'fulfilled' &&
      contactsResponse.status === 'fulfilled'
    ) {
      gmailV1SchemaProfileSchema.parse(userResponse.value.data)
      peopleV1SchemaPersonSchema.parse(contactsResponse.value.data)
      const getName = () => {
        const displayName =
          contactsResponse?.value?.data?.names?.at(0)?.displayName
        return displayName
      }
      const result = {
        name: getName(),
        ...userResponse.value.data,
      }
      const validatedResponse =
        extendedGmailV1SchemaProfileSchemaSchema.parse(result)
      return validatedResponse
    }
    return new Error('No profile found...')
  } catch (err) {
    errorHandeling(err, 'getProfile')
  }
}
var getProfile = async (req, res) => {
  const { data, statusCode } = await authMiddleware(fetchProfile)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Base/getBase.ts
var createMissingLabel = async ({ auth, label }) => {
  try {
    const req = {
      body: {
        name: label,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    }
    const labelResponse = await newLabel(auth, req)
    return labelResponse
  } catch (err) {
    errorHandeling(err, 'createMissingLabel')
    return void 0
  }
}
var detectSettingsLabel = async ({ auth, labels }) => {
  const settingsLabel = findSettings_default(labels, auth)
  if (!settingsLabel || !settingsLabel.id) {
    const response = await createSettingsLabel(auth)
    if (!response) {
      throw Error('Cannot create settings label')
    }
    return response
  } else {
    return settingsLabel
  }
}
var stringArraySchema = z4.array(z4.string())
async function getBase(req, res) {
  try {
    const { BASE_ARRAY } = req.body
    const validatedRequestBody = stringArraySchema.parse(BASE_ARRAY)
    if (!req.headers.authorization) {
      throw Error('No Authorization header found')
    }
    const useLocalRoute =
      typeof JSON.parse(req.headers.authorization) === 'object'
    const auth = useLocalRoute
      ? await authenticateUserLocal(req)
      : await authenticateUserSession(req)
    if (!auth) {
      throw new Error('Unable to auth the user')
    }
    const userResponse = await fetchProfile(auth)
    const userData = userResponse || {}
    if (!userData || userData instanceof Error) {
      throw new Error('Invalid user response data')
    }
    const { emailAddress } = userData
    if (!emailAddress) {
      throw new Error('Invalid user email address')
    }
    req.query = { emailId: emailAddress }
    const [sendAsResponse, labelResponse] = await Promise.allSettled([
      fetchSendAs(auth, req),
      fetchLabels(auth),
    ])
    if (labelResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${
          labelResponse?.reason || JSON.stringify(labelResponse)
        }. Please try again later.`,
      })
    }
    if (sendAsResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${
          sendAsResponse?.reason || JSON.stringify(sendAsResponse)
        }. Please try again later.`,
      })
    }
    const promisesHaveSettledWithValues =
      sendAsResponse.status === 'fulfilled' &&
      labelResponse.status === 'fulfilled'
    if (
      !promisesHaveSettledWithValues ||
      sendAsResponse.value instanceof Error ||
      labelResponse.value instanceof Error
    ) {
      throw new Error('Invalid sendAs or label response data')
    }
    const possibleLabels = labelResponse.value?.labels || []
    const nameMapLabels = new Set(possibleLabels.map((label) => label.name))
    const missingLabels = validatedRequestBody.filter(
      (item) => !nameMapLabels.has(item)
    )
    const batchCreateLabels = await Promise.all(
      missingLabels.map((item) => {
        return createMissingLabel({ auth, label: item })
      })
    )
    if (
      batchCreateLabels.some((createdLabel) => createdLabel instanceof Error)
    ) {
      throw new Error('Invalid response on creation of labels')
    }
    const newlyCreatedLabels = batchCreateLabels
      .map((createdLabel) => {
        const checkValue = createdLabel
        if (checkValue && !(checkValue instanceof Error)) {
          return checkValue
        }
        return void 0
      })
      .filter((item) => item !== void 0)
    const labels = [
      .../* @__PURE__ */ new Set([...newlyCreatedLabels, ...possibleLabels]),
    ]
    const detectedSettingsLabel = await detectSettingsLabel({ auth, labels })
    const userSettingsLabel = detectedSettingsLabel
    const parsedSettings = userSettingsSchemaNumericalSizes.parse(
      parseSettings(detectedSettingsLabel)
    )
    const prefetchedBoxes = validatedRequestBody
      .map((baseLabel) => labels.find((item) => item.name === baseLabel))
      .filter((item) => item !== void 0)
    const extendedPrefetchedBoxesWithArchiveLabel = [
      {
        id: ARCHIVE_LABEL,
        name: ARCHIVE_LABEL,
        messageListVisibility: 'show',
        labelListVisibility: 'labelShow',
        type: 'junoCustom',
      },
      ...prefetchedBoxes,
    ]
    const profile = {
      signature: sendAsResponse?.value?.signature ?? '',
      ...userResponse,
    }
    const returnObject = {
      prefetchedBoxes: extendedPrefetchedBoxesWithArchiveLabel,
      profile,
      userSettings: parsedSettings,
      userSettingsLabel,
    }
    return res.status(200).json(returnObject)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

// src/api/Contacts/fetchAllContacts.ts
import { google as google6 } from './node_modules/googleapis/build/src/index.js'
var getContacts = async (auth, req) => {
  const people = google6.people({ version: 'v1', auth })
  const requestBody = {}
  requestBody.pageSize =
    typeof Number(req.query.pageSize) !== 'number'
      ? 1e3
      : Number(req.query.pageSize)
  if (req.query.readMask && typeof req.query.readMask === 'string') {
    requestBody.readMask = req.query.readMask
  }
  if (req.query.pageToken && typeof req.query.pageToken === 'string') {
    requestBody.pageToken = req.query.pageToken
  }
  try {
    const response = await people.otherContacts.list(requestBody)
    if (response?.data) {
      peopleV1SchemaListOtherContactsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No contacts found...')
  } catch (err) {
    errorHandeling(err, 'fetchAllContacts')
  }
}
async function fetchAllContacts(req, res) {
  const { data, statusCode } = await authMiddleware(getContacts)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Contacts/queryContacts.ts
import { google as google7 } from './node_modules/googleapis/build/src/index.js'

// src/api/Contacts/utils/remapContacts.ts
function remapContacts({ results }) {
  return (
    results?.map((contact) => ({
      name: Object.prototype.hasOwnProperty.call(contact.person, 'names')
        ? contact?.person?.names?.[0]?.displayName
        : contact?.person?.emailAddresses?.[0]?.value,
      emailAddress: contact?.person?.emailAddresses?.[0]?.value,
    })) ?? []
  )
}

// src/api/Contacts/queryContacts.ts
var getContacts2 = async (auth, req) => {
  const people = google7.people({ version: 'v1', auth })
  const requestBody = {}
  if (typeof req.query.query === 'string') {
    requestBody.query = req.query.query
  }
  if (typeof req.query.readMask === 'string') {
    requestBody.readMask = req.query.readMask
  }
  try {
    const response = await people.otherContacts.search(requestBody)
    if (response?.data) {
      peopleV1SchemaSearchResponseSchema.parse(response.data)
      return remapContacts({ results: response.data.results })
    }
    return new Error('No contacts found...')
  } catch (err) {
    errorHandeling(err, 'queryContacts')
  }
}
var queryContacts = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getContacts2)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/createDraft.ts
import { google as google8 } from './node_modules/googleapis/build/src/index.js'

// src/utils/formFieldParser/formFieldParser.ts
import formidable from './node_modules/formidable/src/index.js'
async function formFieldParser(req) {
  const form = formidable({ multiples: true })
  const formFields = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ files, ...fields })
    })
  })
  return formFields
}

// src/utils/messageEncoding/messageEncoding.ts
import fs from 'fs'
var messageEncoding = ({
  from,
  body,
  subject,
  to,
  cc,
  bcc,
  signature,
  files,
}) => {
  const nl = '\n'
  const boundary = '__juno__'
  const utf8Subject = subject
    ? `=?utf-8?B?${Buffer.from(subject[0] ?? '').toString('base64')}?=`
    : ''
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    'Content-Type: multipart/alternative; boundary=' + boundary + nl,
    '--' + boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64' + nl,
    `${body}` + nl,
    '',
    `${signature && signature.length > 0 && signature}`,
  ]
  if (files && 'file' in files && files.file.length > 0) {
    for (const file of files.file) {
      const content = fs.readFileSync(file.filepath)
      const toBase64 = Buffer.from(content).toString('base64')
      const attachment = [
        `--${boundary}`,
        `Content-Type: ${file.mimetype}; name="${file.originalFilename}"`,
        `Content-Disposition: attachment; filename="${file.originalFilename}"`,
        `Content-Transfer-Encoding: base64${nl}`,
        toBase64,
      ]
      messageParts.push(attachment.join(nl))
    }
  }
  messageParts.push('--' + boundary + '--')
  const message = messageParts.join(nl)
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return encodedMessage
}
var messageEncoding_default = messageEncoding

// src/api/Drafts/createDraft.ts
async function setupDraft(auth, req) {
  const gmail = google8.gmail({ version: 'v1', auth })
  try {
    if ('body' in req) {
      const parsedResult = await formFieldParser(req)
      const { threadId } = parsedResult
      const response = await gmail.users.drafts.create({
        userId: USER,
        requestBody: {
          message: {
            raw: messageEncoding_default(parsedResult),
            threadId: threadId[0],
          },
        },
      })
      if (response?.status === 200 && response?.data) {
        gmailV1SchemaDraftSchema.parse(response.data)
        return response.data
      } else {
        return new Error('Draft is not created...')
      }
    }
  } catch (err) {
    errorHandeling(err, 'createDraft')
  }
}
var createDraft = async (req, res) => {
  const { data, statusCode } = await authMiddleware(setupDraft)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/deleteDraft.ts
import { google as google9 } from './node_modules/googleapis/build/src/index.js'
var removeDraft = async (auth, req) => {
  const gmail = google9.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req
  try {
    const response = await gmail.users.drafts.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'deleteDraft')
  }
}
var deleteDraft = async (req, res) => {
  const { data, statusCode } = await authMiddleware(removeDraft)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/fetchDrafts.ts
import { google as google10 } from './node_modules/googleapis/build/src/index.js'
var getDrafts = async (auth) => {
  const gmail = google10.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.drafts.list({
      userId: USER,
    })
    if (response?.data) {
      gmailV1SchemaListDraftsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No drafts found...')
  } catch (err) {
    errorHandeling(err, 'fetchDrafts')
  }
}
var fetchDrafts = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getDrafts)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/fetchSingleDraft.ts
import { google as google11 } from './node_modules/googleapis/build/src/index.js'

// src/utils/threadRemap/types/threadRemapTypes.ts
import { z as z5 } from './node_modules/zod/lib/index.mjs'
var PayloadHeaders = z5.object({
  deliveredTo: z5.string().nullable(),
  date: z5.string().nullable(),
  from: z5.string().nullable(),
  subject: z5.string().nullable(),
  to: z5.string().nullable(),
  cc: z5.string().nullable(),
  bcc: z5.string().nullable(),
})
var SimpleMessage = z5.object({
  id: z5.string(),
  threadId: z5.string(),
  labelIds: z5.array(z5.string()),
  snippet: z5.string(),
  payload: z5.object({
    mimeType: z5.string(),
    headers: PayloadHeaders,
    files: z5.array(z5.any()),
  }),
  sizeEstimate: z5.number(),
  historyId: z5.string(),
  internalDate: z5.string(),
})
var ThreadSimpleRemap = z5.object({
  id: z5.string(),
  historyId: z5.string(),
  messages: z5.array(SimpleMessage),
})
var PayloadHeadersEnhanced = PayloadHeaders.extend({
  listUnsubscribe: z5.string().nullable(),
})
var FullMessage = z5.object({
  id: z5.string(),
  threadId: z5.string(),
  labelIds: z5.array(z5.string()),
  snippet: z5.string(),
  payload: z5.object({
    mimeType: z5.string(),
    headers: PayloadHeadersEnhanced,
    body: z5.object({
      emailHTML: z5.string(),
      emailFileHTML: z5.array(z5.any()),
      removedTrackers: z5.array(z5.string()).optional(),
    }),
    files: z5.array(gmailV1SchemaMessagePartSchema),
    parts: z5.array(gmailV1SchemaMessagePartSchema).optional(),
  }),
  sizeEstimate: z5.number(),
  historyId: z5.string(),
  internalDate: z5.string(),
})
var ThreadObject = z5.object({
  id: z5.string(),
  historyId: z5.string(),
  messages: z5.array(FullMessage),
})

// src/utils/bodyDecoder/bodyDecoder.ts
import * as cheerio6 from './node_modules/cheerio/lib/esm/index.js'

// src/utils/bodyDecoder/utils/changeSignatureColor/changeSignatureColor.ts
import * as cheerio from './node_modules/cheerio/lib/esm/index.js'
function changeSignatureColor(activeDocument) {
  const $ = cheerio.load(activeDocument.emailHTML)
  $('div[class*="signature"]').each((_, element) => {
    $(element).attr('style', 'color: var(--color-neutral-400) !important')
  })
  return { ...activeDocument, emailHTML: $.html() }
}

// src/utils/bodyDecoder/utils/cleanLink.ts
import * as cheerio2 from './node_modules/cheerio/lib/esm/index.js'
var SEPERATOR = 'utm'
var LIMIT = 1
function cleanLink(activeDocument) {
  const $ = cheerio2.load(activeDocument.emailHTML)
  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    if (elementHref) {
      const [firstPartLink] = elementHref.split(SEPERATOR, LIMIT)
      if (firstPartLink && firstPartLink.length > 0) {
        $(documentLink).attr('href', firstPartLink)
      }
    }
  })
  return { ...activeDocument, emailHTML: $.html() }
}

// src/utils/bodyDecoder/utils/enhancePlainText.ts
import AutoLinker from './node_modules/autolinker/dist/commonjs/index.js'
function enhancePlainText(localString) {
  const lineBreakRegex = /(?:\r\n|\r|\n)/g
  return (
    AutoLinker.link(localString, { email: false }).replace(
      lineBreakRegex,
      '<br>'
    ) ?? ''
  )
}

// src/utils/bodyDecoder/utils/openLinkInNewTab.ts
import * as cheerio3 from './node_modules/cheerio/lib/esm/index.js'
function openLinkInNewTab(activeDocument) {
  const $ = cheerio3.load(activeDocument.emailHTML)
  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    if (elementHref && !elementHref.includes('mailto:')) {
      $(documentLink).attr('target', '_blank')
      $(documentLink).attr('rel', 'noreferer noopener')
      $(documentLink).attr('aria-label', 'Opens in new tab')
    }
  })
  return { ...activeDocument, emailHTML: $.html() }
}

// src/utils/bodyDecoder/utils/removeScripts.ts
import * as cheerio4 from './node_modules/cheerio/lib/esm/index.js'
function removeScripts(orderedObject) {
  const $ = cheerio4.load(orderedObject.emailHTML)
  $('script').each((_, foundScript) => {
    $(foundScript).remove()
  })
  return orderedObject
}

// src/utils/bodyDecoder/utils/removeTrackers/removeTrackers.ts
import * as cheerio5 from './node_modules/cheerio/lib/esm/index.js'
var TRACKERS_SELECTORS = [
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
var TRACKERS_SELECTORS_INCLUDES = [
  { attribute: 'src', value: 'http://mailstat.us' },
  { attribute: 'src', value: 'https://open.convertkit-' },
]
function parseStyleIntoObject(documentImage) {
  let foundImage = null
  const fetchedStyle = documentImage.attributes.filter(
    (attribute) => attribute.name === 'style'
  )
  if (fetchedStyle.length > 0) {
    const parsedStyle = fetchedStyle
      .map((item) => item.value?.split(/\s*;\s*/g))
      .flat(1)
    for (let i = 0; parsedStyle.length > i; i += 1) {
      const parsedStyleEntry = parsedStyle[i]
      if (parsedStyleEntry) {
        const parts = parsedStyleEntry.match(/^([^:]+)\s*:\s*(.+)/)
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
function detectAndRemove(documentImage) {
  let foundImage = null
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
function removeTrackers(orderedObject) {
  const localCopyOrderedObject = {
    ...orderedObject,
    removedTrackers: [],
  }
  const $ = cheerio5.load(orderedObject.emailHTML)
  let foundImage = null
  $('img').each((_, documentImage) => {
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
      if (srcOfTracker && localCopyOrderedObject.removedTrackers) {
        localCopyOrderedObject.removedTrackers.push(srcOfTracker.value)
      }
    }
  })
  localCopyOrderedObject.emailHTML = $.html()
  return localCopyOrderedObject
}

// src/utils/decodeBase64.ts
import base64url from './node_modules/base64url/index.js'
function baseBase64(base64Data) {
  const b64 = base64url.toBase64(base64Data)
  return b64
}
function decodeBase64(base64Data) {
  if (base64Data !== void 0 && base64Data !== 'undefined') {
    const checkedString = base64Data.replaceAll(/-/g, '+')
    const b64 = base64url.decode(checkedString)
    return b64
  }
  return void 0
}

// src/utils/bodyDecoder/bodyDecoder.ts
var decodedString
var localMessageId
var decodedResult = []
var localGmail = null
var inlineImageDecoder = async ({ attachmentData, messageId }) => {
  const { body, filename, mimeType, headers } = attachmentData
  const getAttachment2 = async () => {
    if (localGmail && body?.attachmentId) {
      try {
        const response2 = await localGmail.users.messages.attachments.get({
          userId: USER,
          messageId,
          id: body?.attachmentId,
        })
        if (response2 && response2.data) {
          return response2.data
        }
        return 'Message attachment not found...'
      } catch (err) {
        throw Error(`Get Attachment returned an error: ${err}`)
      }
    }
  }
  const response = await getAttachment2()
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
}
var loopThroughBodyParts = async ({ inputObject, signal }) => {
  if (signal?.aborted) {
    throw new Error('Decoding aborted')
  }
  const loopingFunction = async ({ loopObject }) => {
    try {
      const objectKeys = Object.keys(loopObject)
      for (const objectKey of objectKeys) {
        if (objectKey === 'body') {
          if (loopObject?.body?.size && loopObject?.body?.size > 0) {
            if (loopObject.body?.attachmentId && localMessageId) {
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
            loopObject.parts.forEach((part) => {
              void loopingFunction({
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
var orderArrayPerType = (response) => {
  const firstStringOnly = []
  const objectOnly = []
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
var prioritizeHTMLbodyObject = (response) => {
  let htmlObject = ''
  let noHtmlObject = ''
  if (response.emailHTML.length === 1 && response.emailHTML[0]) {
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
var placeInlineImage = (orderedObject) => {
  if (orderedObject.emailFileHTML.length > 0) {
    const processedObjectArray = []
    const $ = cheerio6.load(orderedObject.emailHTML)
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
    const unprocessedValidObjects = orderedObject.emailFileHTML
      .filter((item) => !processedObjectArray.includes(item))
      .filter((item) => item.mimeType !== MIME_TYPE_NO_INLINE)
    return { emailFileHTML: unprocessedValidObjects, emailHTML: $.html() }
  }
  return orderedObject
}
var bodyDecoder = async ({ gmail, inputObject, messageId, signal }) => {
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
      decodedResult = []
      if (response) {
        const ordered = orderArrayPerType(response)
        const prioritized = prioritizeHTMLbodyObject(ordered)
        const inlinedImages = placeInlineImage(prioritized)
        const removedTrackers = removeTrackers(inlinedImages)
        const removedScript = removeScripts(removedTrackers)
        const openLinks = openLinkInNewTab(removedScript)
        const cleanedLinks = cleanLink(openLinks)
        const alteredSignature = changeSignatureColor(cleanedLinks)
        return alteredSignature
      } else {
        throw Error('Got no response from the body parts')
      }
    }
    return { emailHTML: '', emailFileHTML: [] }
  } catch (err) {
    return err
  }
}
var bodyDecoder_default = bodyDecoder

// src/utils/fetchAttachments/fetchAttachments.ts
var foundAttachments = []
var loopThroughParts = ({ input, reset = false }) => {
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
function checkAttachment(message) {
  if (message?.payload?.parts) {
    return loopThroughParts({ input: message.payload.parts, reset: true })
  }
  return []
}

// src/utils/findHeader.ts
function findHeader(rawMessage, query) {
  if (
    rawMessage?.payload?.headers &&
    rawMessage?.payload?.headers?.find((e) => e.name === query)
  ) {
    return (
      rawMessage.payload.headers.find((e) => e.name === query)?.value ?? null
    )
  }
  if (
    rawMessage?.payload?.headers &&
    rawMessage.payload.headers.find((e) => e.name === query.toLowerCase())
  ) {
    return (
      rawMessage.payload.headers.find((e) => e.name === query.toLowerCase())
        ?.value ?? null
    )
  }
  return null
}

// src/utils/handleListUnsubscribe/fetchUnsubscribeLink.ts
import * as cheerio7 from './node_modules/cheerio/lib/esm/index.js'
import { isText } from './node_modules/domhandler/lib/esm/index.js'
var CHECK_WORDS = [
  'afmelden',
  'unsubscribe',
  'optout',
  'subscription',
  'uit te schrijven',
  'turn them off',
  'uitschrijven',
  'no longer wish',
  'Opt-out',
]
var REGEX = new RegExp(CHECK_WORDS.join('|'), 'i')
function fetchUnsubscribeLink(activeDocument) {
  const $ = cheerio7.load(activeDocument.emailHTML)
  const matchedElements = []
  $('a').each((_, documentLink) => {
    const elementHref = $(documentLink).attr('href')
    const elementClass = $(documentLink).attr('class')
    const parentElement = $(documentLink).parent()
    if (elementHref && REGEX.test(elementHref)) {
      matchedElements.push(elementHref)
    }
    if (
      documentLink.childNodes
        .map((childNode) => {
          if (isText(childNode)) {
            return childNode.data ?? ''
          }
          return ''
        })
        .every((textNode) => REGEX.test(textNode)) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
    if (elementClass && REGEX.test(elementClass) && elementHref) {
      matchedElements.push(elementHref)
    }
    if (
      parentElement.text() &&
      REGEX.test(parentElement.text()) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
    const previousSibling = parentElement.prev()
    if (
      previousSibling.length &&
      previousSibling
        .find('*')
        .toArray()
        .every((el) => REGEX.test($(el).text())) &&
      elementHref
    ) {
      matchedElements.push(elementHref)
    }
  })
  if (matchedElements.length > 0) {
    const lastMatch = matchedElements[matchedElements.length - 1]
    if (lastMatch) {
      return lastMatch
    } else {
      return null
    }
  } else {
    return null
  }
}

// src/utils/handleListUnsubscribe/handleListUnsubscribe.ts
function handleListUnsubscribe(convertedBody, unsubscribeLink) {
  if (!unsubscribeLink) {
    return fetchUnsubscribeLink(convertedBody)
  }
  const links = unsubscribeLink
    .split(',')
    .map((link) => link.trim().replace(/(<|>)+/g, ''))
  let preferNoMailLink = links.find((item) => !item.startsWith('mailto'))
  if (!preferNoMailLink) {
    preferNoMailLink = links[0]
  }
  return preferNoMailLink
}

// src/utils/threadRemap/threadFullRemap.ts
var remapPayloadHeaders = (rawMessage, convertedBody) => {
  return {
    deliveredTo: findHeader(rawMessage, 'Delivered-To'),
    date: findHeader(rawMessage, 'Date'),
    from: findHeader(rawMessage, 'From'),
    subject: findHeader(rawMessage, 'Subject'),
    listUnsubscribe: handleListUnsubscribe(
      convertedBody,
      findHeader(rawMessage, 'List-Unsubscribe')
    ),
    to: findHeader(rawMessage, 'To'),
    cc: findHeader(rawMessage, 'Cc'),
    bcc: findHeader(rawMessage, 'Bcc'),
  }
}
var remapFullMessage = async (rawMessage, gmail) => {
  const convertedBody = await bodyDecoder_default({
    gmail,
    inputObject: rawMessage.payload,
    messageId: rawMessage?.id,
  })
  return {
    id: rawMessage.id,
    threadId: rawMessage.threadId,
    labelIds: rawMessage.labelIds,
    snippet: rawMessage.snippet,
    payload: {
      mimeType: rawMessage?.payload?.mimeType,
      headers: remapPayloadHeaders(rawMessage, convertedBody),
      body: convertedBody,
      files: checkAttachment(rawMessage),
      parts: rawMessage?.payload?.parts,
    },
    sizeEstimate: rawMessage.sizeEstimate,
    historyId: rawMessage.historyId,
    internalDate: rawMessage.internalDate,
  }
}
async function threadFullRemap(rawObject, gmail) {
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

// src/api/Drafts/fetchSingleDraft.ts
var getDraft = async (auth, req) => {
  const gmail = google11.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.drafts.get({
      userId: USER,
      id: req.params.id,
      format: 'full',
    })
    if (response?.data?.message) {
      gmailV1SchemaDraftSchema.parse(response.data)
      const decodedResult2 = await remapFullMessage(
        response.data.message,
        gmail
      )
      return { id: response.data.id, message: decodedResult2 }
    }
    return new Error('Draft not found...')
  } catch (err) {
    errorHandeling(err, 'fetchSingleDraft')
  }
}
var fetchSingleDraft = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getDraft)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/sendDraft.ts
import { google as google12 } from './node_modules/googleapis/build/src/index.js'
var exportDraft = async (auth, req) => {
  const gmail = google12.gmail({ version: 'v1', auth })
  const { id } = req.body
  try {
    const response = await gmail.users.drafts.send({
      userId: USER,
      requestBody: {
        id,
      },
    })
    if (response) {
      gmailV1SchemaMessageSchema.parse(response)
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    errorHandeling(err, 'sendDraft')
  }
}
var sendDraft = async (req, res) => {
  const { data, statusCode } = await authMiddleware(exportDraft)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Drafts/updateDraft.ts
import { google as google13 } from './node_modules/googleapis/build/src/index.js'
var exportDraft2 = async (auth, req) => {
  const gmail = google13.gmail({ version: 'v1', auth })
  try {
    if ('body' in req) {
      const parsedResult = await formFieldParser(req)
      const { draftId, threadId, messageId } = parsedResult
      const response = await gmail.users.drafts.update({
        userId: USER,
        id: draftId,
        requestBody: {
          message: {
            raw: messageEncoding_default(parsedResult),
            id: messageId[0],
            threadId: threadId[0],
          },
        },
      })
      if (response?.status === 200 && response?.data) {
        gmailV1SchemaDraftSchema.parse(response.data)
        return response
      } else {
        return new Error('Draft is not updated...')
      }
    }
  } catch (err) {
    errorHandeling(err, 'updateDraft')
  }
}
var updateDraft = async (req, res) => {
  const { data, statusCode } = await authMiddleware(exportDraft2)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/health.ts
var health = (req, res) => {
  try {
    const response = 'I am healthy.'
    return res.status(200).json(response)
  } catch (err) {
    const errResponse = 'I am unhealthy.'
    res.status(401).json(errResponse)
  }
}

// src/api/History/listHistory.ts
import { google as google15 } from './node_modules/googleapis/build/src/index.js'

// src/utils/onlyLegalLabelObjects.ts
var onlyLegalLabels = ({ labelNames, storageLabels }) => {
  const idMapStorageLabels = storageLabels.map((label) => label.id)
  const filterArray = labelNames.filter((el) => idMapStorageLabels.includes(el))
  const newArray = []
  for (let i = 0; i < filterArray.length; i += 1) {
    const pushItem = storageLabels.find((item) => item.id === filterArray[i])
    if (pushItem) {
      newArray.push(pushItem)
    }
  }
  return newArray
}
var onlyLegalLabelObjects_default = onlyLegalLabels

// src/api/History/handleHistoryObject.ts
var HISTORY_NEXT_PAGETOKEN = 'history'
var restructureObject = (message) => {
  if (message === void 0) {
    return
  }
  const newObject = { ...message, id: message.threadId }
  return newObject
}
function handleHistoryObject({ history, storageLabels }) {
  const inboxFeed = {
    labels: [INBOX_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const toDoLabelId = storageLabels.find(
    (label) => label.name === 'Juno/To Do'
  )?.id
  if (!toDoLabelId) {
    throw Error('Cannot find the to do label')
  }
  const todoFeed = {
    labels: [toDoLabelId],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const sentFeed = {
    labels: [SENT_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const draftFeed = {
    labels: [DRAFT_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const archiveFeed = {
    labels: [ARCHIVE_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const handleRemovalUnreadLabel = (item) => {
    const message = item?.labelsRemoved?.at(0)?.message
    const labelIds = item?.labelsRemoved?.at(0)?.labelIds
    const messageLabelIds = message?.labelIds
    const labelIdsHasUnread = labelIds?.includes(UNREAD_LABEL)
    if (labelIdsHasUnread && messageLabelIds) {
      const staticOnlyLegalLabels = onlyLegalLabelObjects_default({
        labelNames: messageLabelIds,
        storageLabels,
      })
      if (
        staticOnlyLegalLabels.length > 0 &&
        staticOnlyLegalLabels.some((label) => label.id === INBOX_LABEL)
      ) {
        inboxFeed.threads.push(restructureObject(message))
      }
      if (
        staticOnlyLegalLabels.length > 0 &&
        staticOnlyLegalLabels.some((label) => label.id === toDoLabelId)
      ) {
        todoFeed.threads.push(restructureObject(message))
      }
      archiveFeed.threads.push(restructureObject(message))
    }
  }
  const handleRemovalOriginFeed = (item) => {
    const message = item?.labelsRemoved?.at(0)?.message
    const labelIds = item?.labelsRemoved?.at(0)?.labelIds
    if (message?.threadId) {
      if (labelIds?.includes(INBOX_LABEL)) {
        const output = inboxFeed.threads.filter(
          (filterItem) => filterItem?.id !== message?.threadId
        )
        inboxFeed.threads = output
      }
      if (labelIds?.includes(toDoLabelId)) {
        const output = todoFeed.threads.filter(
          (filterItem) => filterItem?.id !== message?.threadId
        )
        todoFeed.threads = output
      }
    }
  }
  const handleAdditionLabel = (item) => {
    const message = item?.labelsAdded?.at(0)?.message
    const labelIds = item.labelsAdded?.at(0)?.labelIds
    if (labelIds?.includes(INBOX_LABEL)) {
      inboxFeed.threads.push(restructureObject(message))
    }
    if (labelIds?.includes(toDoLabelId)) {
      todoFeed.threads.push(restructureObject(message))
    }
    if (labelIds?.includes(SENT_LABEL)) {
      sentFeed.threads.push(restructureObject(message))
    }
  }
  const handleAdditionDraftMessage = (item) => {
    const message = item?.messagesAdded?.at(0)?.message
    if (message?.labelIds) {
      const draftThreadIndex = draftFeed.threads.findIndex((thread) => {
        if (item?.messagesAdded) {
          return thread?.threadId === message?.threadId
        }
        return -1
      })
      if (draftThreadIndex > -1) {
        draftFeed.threads.splice(draftThreadIndex, 1)
        draftFeed.threads.push(restructureObject(message))
      } else {
        draftFeed.threads.push(restructureObject(message))
      }
    }
  }
  const handleAdditionMessage = (item) => {
    const message = item?.messagesAdded?.at(0)?.message
    const messageLabelIds = message?.labelIds
    if (messageLabelIds) {
      if (messageLabelIds.includes(INBOX_LABEL)) {
        inboxFeed.threads.push(restructureObject(message))
      }
      if (messageLabelIds.includes(toDoLabelId)) {
        todoFeed.threads.push(restructureObject(message))
      }
      if (messageLabelIds.includes(SENT_LABEL)) {
        sentFeed.threads.push(restructureObject(message))
      }
      if (messageLabelIds.includes(DRAFT_LABEL)) {
        handleAdditionDraftMessage(item)
      }
    }
  }
  if (Array.isArray(history)) {
    try {
      const cleanHistoryArray = history.filter(
        (item) => Object.keys(item).length > 2
      )
      for (const item of cleanHistoryArray) {
        if (item) {
          if (Object.prototype.hasOwnProperty.call(item, 'labelsRemoved')) {
            handleRemovalUnreadLabel(item)
            handleRemovalOriginFeed(item)
          }
          if (Object.prototype.hasOwnProperty.call(item, 'labelsAdded')) {
            handleAdditionLabel(item)
          }
          if (Object.prototype.hasOwnProperty.call(item, 'messagesAdded')) {
            handleAdditionMessage(item)
          }
        }
      }
    } catch (err) {
      process.env.NODE_ENV === 'development' && console.error(err)
    }
  }
  return [inboxFeed, todoFeed, sentFeed, draftFeed, archiveFeed]
}

// src/api/Threads/fetchSimpleThreads.ts
import { google as google14 } from './node_modules/googleapis/build/src/index.js'

// src/api/Threads/threadRequest.ts
var requestBodyCreator = (req) => {
  const requestBody = {
    userId: USER,
  }
  requestBody.maxResults =
    typeof Number(req.query.maxResults) !== 'number'
      ? 20
      : Number(req.query.maxResults)
  if (req.query.labelIds && req.query.labelIds !== 'undefined') {
    const typedLabelIdsReq = req.query.labelIds
    if (!typedLabelIdsReq.includes(ARCHIVE_LABEL)) {
      requestBody.labelIds = typedLabelIdsReq
    } else {
      requestBody.q = '-label:inbox -label:sent -label:drafts -label:Juno/To Do'
    }
  }
  if (req?.query?.pageToken && typeof req.query.pageToken === 'string') {
    requestBody.pageToken = req.query.pageToken
  }
  if (req.query.q && typeof req.query.q === 'string') {
    requestBody.q = req.query.q
  }
  return requestBody
}
var threadRequest_default = requestBodyCreator

// src/utils/threadRemap/threadSimpleRemap.ts
var remapPayloadHeaders2 = (rawMessage) => {
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
var remapSimpleMessage = (rawMessage) => {
  return {
    id: rawMessage.id,
    threadId: rawMessage.threadId,
    labelIds: rawMessage.labelIds,
    snippet: rawMessage.snippet,
    payload: {
      mimeType: rawMessage?.payload?.mimeType,
      headers: remapPayloadHeaders2(rawMessage),
      files: checkAttachment(rawMessage),
    },
    sizeEstimate: rawMessage.sizeEstimate,
    historyId: rawMessage.historyId,
    internalDate: rawMessage.internalDate,
  }
}
async function threadSimpleRemap(rawObject) {
  if (rawObject.messages) {
    const mappedMessages = rawObject.messages.map((message) =>
      remapSimpleMessage(message)
    )
    const result = {
      id: rawObject.id,
      historyId: rawObject.historyId,
      messages: await Promise.all(mappedMessages),
    }
    ThreadSimpleRemap.parse(result)
    return result
  }
  return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
}

// src/api/Threads/fetchSimpleThreads.ts
async function singleThread(thread, gmail) {
  const { id } = thread
  try {
    if (id) {
      const response = await gmail.users.threads.get({
        userId: USER,
        id,
        format: 'full',
      })
      if (response && response.data) {
        gmailV1SchemaThreadSchema.parse(response.data)
        return response.data
      }
    }
    throw Error('Thread not found...')
  } catch (err) {
    errorHandeling(err, 'singleThread')
  }
}
var hydrateMetaList = async ({ gmail, response, timeStampLastFetch }) => {
  const { threads } = response
  if (!threads) {
    throw new Error('No threads found on the response')
  }
  const fetchedThreads = await Promise.all(
    threads.map((thread) => singleThread(thread, gmail))
  )
  const result = {
    nextPageToken: null,
    ...response,
    threads: await Promise.all(
      fetchedThreads.map((thread) => thread && threadSimpleRemap(thread))
    ),
    timestamp: timeStampLastFetch,
  }
  return result
}
var getSimpleThreads = async (auth, req) => {
  const gmail = google14.gmail({ version: 'v1', auth })
  const requestBody = threadRequest_default(req)
  try {
    const response = await gmail.users.threads.list(requestBody)
    const timeStampLastFetch = Date.now()
    if (
      !response ||
      !response?.data ||
      response.data.resultSizeEstimate === 0
    ) {
      return {
        nextPageToken: null,
        threads: [],
        timestamp: timeStampLastFetch,
        ...response.data,
      }
    }
    const validatedData = gmailV1SchemaListThreadsResponseSchema.parse(
      response.data
    )
    const output = await hydrateMetaList({
      gmail,
      response: validatedData,
      timeStampLastFetch,
    })
    return output
  } catch (err) {
    errorHandeling(err, 'fetchSimpleThreads')
  }
}
var fetchSimpleThreads = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getSimpleThreads)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/History/listHistory.ts
var fetchHistory = async (auth, req) => {
  const gmail = google15.gmail({ version: 'v1', auth })
  try {
    const { startHistoryId, storageLabels } = req.body.params
    const response = await gmail.users.history.list({
      userId: USER,
      historyTypes: ['labelAdded', 'labelRemoved', 'messageAdded'],
      startHistoryId,
    })
    if (response?.status === 200 && storageLabels) {
      gmailV1SchemaListHistoryResponseSchema.parse(response.data)
      const { data } = response
      if (!data.history) {
        const emptyResponse = {
          labels: [],
          threads: [],
        }
        return [emptyResponse]
      }
      const history = handleHistoryObject({
        history: data.history,
        storageLabels,
      })
      const timeStampLastFetch = Date.now()
      const hydratedOutput = await Promise.all(
        history.map((historyItem) =>
          hydrateMetaList({
            gmail,
            timeStampLastFetch,
            response: historyItem,
          })
        )
      )
      return hydratedOutput
    }
    return new Error('No history found...')
  } catch (err) {
    errorHandeling(err, 'listHistory')
  }
}
var listHistory = async (req, res) => {
  const { data, statusCode } = await authMiddleware(fetchHistory)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Labels/getSingleLabel.ts
import { google as google16 } from './node_modules/googleapis/build/src/index.js'
var fetchSingleLabel = async (auth, req) => {
  const gmail = google16.gmail({ version: 'v1', auth })
  const { id } = req.params
  try {
    const response = await gmail.users.labels.get({
      userId: USER,
      id,
    })
    if (response?.data) {
      gmailV1SchemaLabelSchema.parse(response.data)
      return response.data
    }
    return new Error('No Label found...')
  } catch (err) {
    errorHandeling(err, 'getSingleLabel')
  }
}
var getSingleLabel = async (req, res) => {
  const { data, statusCode } = await authMiddleware(fetchSingleLabel)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Labels/updateLabel.ts
import { google as google17 } from './node_modules/googleapis/build/src/index.js'
var handleRequestBody = ({ requestBody }) => {
  if (typeof requestBody !== 'object' || requestBody === null) {
    return new Error('Invalid request body received from the frontend.')
  }
  if (
    'isSettings' in requestBody &&
    requestBody.isSettings &&
    'value' in requestBody &&
    'settingsLabel' in requestBody
  ) {
    const { value, settingsLabel } = requestBody
    const parsedRequestBodyValue = userSettingsSchemaNumericalSizes.parse(value)
    const labelAsString = buildLabelString(parsedRequestBodyValue)
    const validatedSettingsLabel = gmailV1SchemaLabelSchema.parse(settingsLabel)
    return { ...validatedSettingsLabel, name: labelAsString }
  }
  const typedRegularRequestBody = requestBody
  return typedRegularRequestBody
}
var refreshLabel = async (auth, req) => {
  try {
    const gmail = google17.gmail({ version: 'v1', auth })
    const { id, requestBody } = req.body
    const toUseRequestBody = handleRequestBody({ requestBody })
    if (toUseRequestBody instanceof Error) {
      throw toUseRequestBody
    }
    if (!id) {
      throw new Error('Invalid id value received')
    }
    const response = await gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody: toUseRequestBody,
    })
    if (response?.data) {
      const validatedResponse = gmailV1SchemaLabelSchema.parse(response.data)
      return validatedResponse
    }
    return new Error('No labels created...')
  } catch (err) {
    errorHandeling(err, 'updateLabels')
  }
}
var updateLabel = async (req, res) => {
  const { data, statusCode } = await authMiddleware(refreshLabel)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Message/deleteMessage.ts
import { google as google18 } from './node_modules/googleapis/build/src/index.js'
var deleteSingleMessage = async (auth, req) => {
  const gmail = google18.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req
  try {
    const response = await gmail.users.messages.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'deleteMessage')
  }
}
var deleteMessage = async (req, res) => {
  const { data, statusCode } = await authMiddleware(deleteSingleMessage)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Message/fetchMessageAttachment.ts
import { google as google19 } from './node_modules/googleapis/build/src/index.js'
var getAttachment = async (auth, req) => {
  const gmail = google19.gmail({ version: 'v1', auth })
  const { messageId } = req.params
  const attachmentId = req.params.id
  try {
    const response = await gmail.users.messages.attachments.get({
      userId: USER,
      messageId,
      id: attachmentId,
    })
    if (response?.data) {
      gmailV1SchemaMessagePartBodySchema.parse(response.data)
      return response.data
    }
    return new Error('Message attachment not found4...')
  } catch (err) {
    errorHandeling(err, 'fetchMessageAttachment')
  }
}
var fetchMessageAttachment = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getAttachment)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Message/sendMessage.ts
import { google as google20 } from './node_modules/googleapis/build/src/index.js'
var exportMessage = async (auth, req) => {
  const gmail = google20.gmail({ version: 'v1', auth })
  const { id, threadId } = req.body
  try {
    if ('body' in req) {
      const parsedResult = await formFieldParser(req)
      const response = await gmail.users.messages.send({
        userId: USER,
        requestBody: {
          raw: messageEncoding_default(parsedResult),
          id,
          threadId,
        },
      })
      if (response) {
        gmailV1SchemaMessageSchema.parse(response)
        return response
      }
      return new Error('Mail was not sent...')
    }
  } catch (err) {
    errorHandeling(err, 'sendMessage')
  }
}
var sendMessage = async (req, res) => {
  const { data, statusCode } = await authMiddleware(exportMessage)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Message/thrashMessage.ts
import { google as google21 } from './node_modules/googleapis/build/src/index.js'
var thrashSingleMessage = async (auth, req) => {
  const gmail = google21.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.messages.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response?.data) {
      gmailV1SchemaMessageSchema.parse(response)
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    errorHandeling(err, 'thrashMessage')
  }
}
var thrashMessage = async (req, res) => {
  const { data, statusCode } = await authMiddleware(thrashSingleMessage)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Message/updateMessage.ts
import { google as google22 } from './node_modules/googleapis/build/src/index.js'
var modifyMessage = async (auth, req) => {
  const gmail = google22.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.messages.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response?.data) {
      gmailV1SchemaMessageSchema.parse(response)
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    errorHandeling(err, 'updateMessage')
  }
}
var updateMessage = async (req, res) => {
  const { data, statusCode } = await authMiddleware(modifyMessage)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Threads/deleteThread.ts
import { google as google23 } from './node_modules/googleapis/build/src/index.js'
var deleteSingleThread = async (auth, req) => {
  const gmail = google23.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req
  try {
    const response = await gmail.users.threads.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'deleteThread')
  }
}
var deleteThread = async (req, res) => {
  const { data, statusCode } = await authMiddleware(deleteSingleThread)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Threads/fetchFullThreads.ts
import { google as google24 } from './node_modules/googleapis/build/src/index.js'
async function singleThread2(thread, gmail) {
  try {
    const { id } = thread
    if (id) {
      const response = await gmail.users.threads.get({
        userId: USER,
        id,
        format: 'full',
      })
      if (!response.data) {
        throw Error('Thread not found...')
      }
      const validatedData = gmailV1SchemaThreadSchema.parse(response.data)
      return validatedData
    }
    throw Error('Thread not found...')
  } catch (err) {
    errorHandeling(err, 'singleThread')
  }
}
var getFullThreads = async (auth, req) => {
  const gmail = google24.gmail({ version: 'v1', auth })
  const requestBody = threadRequest_default(req)
  try {
    const response = await gmail.users.threads.list(requestBody)
    if (!response || !response.data) {
      throw new Error('Invalid response on listing threads')
    }
    gmailV1SchemaListThreadsResponseSchema.parse(response.data)
    const hydrateMetaList2 = async () => {
      const { threads } = response.data
      if (!threads) {
        throw new Error('No threads found in response')
      }
      const timeStampLastFetch = Date.now()
      const fetchedThreads = await Promise.all(
        threads.map((thread) => singleThread2(thread, gmail))
      )
      const result = {
        ...response.data,
        threads: await Promise.all(
          fetchedThreads.map(
            (thread) => thread && threadFullRemap(thread, gmail)
          )
        ),
        timestamp: timeStampLastFetch,
      }
      return result
    }
    return hydrateMetaList2()
  } catch (err) {
    errorHandeling(err, 'fetchFullThreads')
  }
}
var fetchFullThreads = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getFullThreads)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Threads/fetchSingleThread.ts
import { google as google25 } from './node_modules/googleapis/build/src/index.js'
var getThread = async (auth, req) => {
  const gmail = google25.gmail({ version: 'v1', auth })
  const { id } = req.params
  try {
    const response = await gmail.users.threads.get({
      userId: USER,
      id,
      format: 'full',
    })
    if (response && response.data) {
      gmailV1SchemaThreadSchema.parse(response.data)
      const expandedResponse = await threadFullRemap(response.data, gmail)
      return expandedResponse
    }
    return new Error('Thread not found...')
  } catch (err) {
    errorHandeling(err, 'fetchSingleThread')
  }
}
var fetchSingleThread = async (req, res) => {
  const { data, statusCode } = await authMiddleware(getThread)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Threads/thrashThread.ts
import { google as google26 } from './node_modules/googleapis/build/src/index.js'
var thrashSingleThread = async (auth, req) => {
  const gmail = google26.gmail({ version: 'v1', auth })
  google26.options({
    http2: false,
  })
  try {
    const response = await gmail.users.threads.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response?.data) {
      gmailV1SchemaThreadSchema.parse(response.data)
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    errorHandeling(err, 'thrashThread')
  }
}
var thrashThread = async (req, res) => {
  const { data, statusCode } = await authMiddleware(thrashSingleThread)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Threads/updateThread.ts
import { google as google27 } from './node_modules/googleapis/build/src/index.js'
var updateSingleThread = async (auth, req) => {
  const gmail = google27.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.threads.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response?.data) {
      gmailV1SchemaThreadSchema.parse(response.data)
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    errorHandeling(err, 'updateThread')
  }
}
var updateThread = async (req, res) => {
  const { data, statusCode } = await authMiddleware(updateSingleThread)(req)
  responseMiddleware(res, statusCode, data)
}

// src/api/Users/logoutUser.ts
var logoutUser = (req, res) => {
  try {
    if (req.headers.authorization) {
      if (req.session.oAuthClient) {
        const oAuth2Client = createAuthClientObject(null)
        oAuth2Client.setCredentials(req.session.oAuthClient)
        void oAuth2Client.revokeCredentials()
      }
      req.session.destroy(function (err) {
        if (err) {
          console.error('logout err', err)
          return res.status(401).json(err.message)
        }
        return res.status(205).json()
      })
    }
  } catch (err) {
    res.status(401).json(err.message)
  }
}

// src/api/Users/updateSendAs.ts
import { google as google28 } from './node_modules/googleapis/build/src/index.js'
var updateSendAsGmail = async (auth, req) => {
  const gmail = google28.gmail({ version: 'v1', auth })
  const { emailId, request } = req.body.params
  try {
    const response = await gmail.users.settings.sendAs.update({
      userId: USER,
      sendAsEmail: emailId,
      requestBody: {
        signature: request.signature,
      },
    })
    if (response?.data) {
      gmailV1SchemaSendAsSchema.parse(response.data)
      return response.data
    }
    return new Error('No data found...')
  } catch (err) {
    errorHandeling(err, 'updateSendAs')
  }
}
var updateSendAs = async (req, res) => {
  const { data, statusCode } = await authMiddleware(updateSendAsGmail)(req)
  responseMiddleware(res, statusCode, data)
}

// src/routes/index.ts
var router = express.Router()
var authEndpoints = {
  '/api/auth/oauth/google/': {
    post: getAuthUrl,
  },
  '/api/auth/oauth/google/callback/': {
    post: getAuthenticateClient2,
  },
}
var baseEndpoints = {
  '/api/base': {
    post: getBase,
  },
}
var contactEndpoints = {
  '/api/contact/search/:query?/:readMask?': {
    get: queryContacts,
  },
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?': {
    get: fetchAllContacts,
  },
}
var draftEndpoints = {
  '/api/drafts/:maxResults?/:nextPageToken?': {
    get: fetchDrafts,
  },
  '/api/draft/:id?': {
    get: fetchSingleDraft,
  },
  '/api/create-draft': {
    post: createDraft,
  },
  '/api/update-draft/?:id?': {
    put: updateDraft,
  },
  '/api/send-draft': {
    post: sendDraft,
  },
  '/api/delete-draft/': {
    delete: deleteDraft,
  },
}
var healthEndpoints = {
  '/api/health': {
    get: health,
  },
}
var historyEndpoints = {
  '/api/history/:startHistoryId?': {
    post: listHistory,
  },
}
var labelEndpoints = {
  '/api/labels': {
    get: getLabels,
    post: createLabel,
    patch: updateLabel,
    delete: removeLabel,
  },
  '/api/label/:id?': {
    get: getSingleLabel,
  },
}
var messageEndpoints = {
  '/api/message/attachment/:messageId?/:id?': {
    get: fetchMessageAttachment,
  },
  '/api/send-message': {
    post: sendMessage,
  },
  '/api/message/:id?': {
    patch: updateMessage,
  },
  '/api/message/thrash/:id?': {
    post: thrashMessage,
  },
  '/api/delete-message/': {
    delete: deleteMessage,
  },
}
var threadEndpoints = {
  '/api/thread/:id?': {
    get: fetchSingleThread,
  },
  '/api/threads/:labelIds?/:maxResults?/:nextPageToken?': {
    get: fetchSimpleThreads,
  },
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?': {
    get: fetchFullThreads,
  },
  '/api/thread/thrash/:id?': {
    post: thrashThread,
  },
  '/api/update-thread/:id?': {
    patch: updateThread,
  },
  '/api/delete-thread/': {
    delete: deleteThread,
  },
}
var userEndpoints = {
  '/api/user': {
    get: getProfile,
  },
  '/api/user/logout': {
    get: logoutUser,
  },
  '/api/settings/updateSendAs': {
    put: updateSendAs,
  },
}
var combinedRoutes = {
  ...authEndpoints,
  ...baseEndpoints,
  ...contactEndpoints,
  ...draftEndpoints,
  ...healthEndpoints,
  ...historyEndpoints,
  ...labelEndpoints,
  ...messageEndpoints,
  ...threadEndpoints,
  ...userEndpoints,
}
for (const [path, handlers] of Object.entries(combinedRoutes)) {
  for (const [method, handler] of Object.entries(handlers)) {
    router[method](path, handler)
  }
}
var routes_default = router

// src/routes/app.ts
process.env.NODE_ENV !== 'production' && // eslint-disable-next-line no-console
  console.log('Booted and ready for usage')
var app = express2()
var redisClient = redis_default()
var redisStore = new RedisStore({
  client: redisClient.on('destroy', (sid) => {
    loggerMiddleware_default.info(`Session ${sid} was destroyed.`)
  }),
  prefix: 'juno:',
})
app.use(compression())
app.set('trust proxy', 1)
var loggingMiddleware = (req, res, next) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    'add' in loggerMiddleware_default
  ) {
    loggerMiddleware_default.defaultMeta = {
      ...loggerMiddleware_default.defaultMeta,
      headers: req.headers,
    }
  }
  next()
}
app.use(loggingMiddleware)
app.use((req, res, next) => {
  if (req.session && req.session.isNew && !req.session.oAuthClient) {
    loggerMiddleware_default.info('A new session was initialized.')
    req.session.isNew = void 0
  }
  next()
})
app.use((req, res, next) => {
  if (req.session) {
    loggerMiddleware_default.info(`Session ID: ${req.sessionID}`)
    if (req.session.oAuthClient) {
      loggerMiddleware_default.info(
        `User oAuthClient: ${req.session.oAuthClient}`
      )
    }
  }
  next()
})
assertNonNullish(process.env.SESSION_SECRET, 'No Session Secret.')
var SEVEN_DAYS = 1e3 * 60 * 10080
app.use(
  session({
    name: 'junoSession',
    store: redisStore,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: true,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV !== 'production' ? false : true,
      httpOnly: true,
      maxAge: SEVEN_DAYS,
      sameSite: process.env.NODE_ENV !== 'production' ? 'lax' : 'none',
      domain:
        process.env.NODE_ENV !== 'production'
          ? void 0
          : process.env.COOKIE_DOMAIN,
    },
  })
)
var LOCALHOST_ORIGIN_TAURI = 'tauri://localhost'
function determineAllowOrigin(req) {
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )
  switch (process.env.NODE_ENV) {
    case 'production': {
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req.headers?.referer
      ) {
        return req.headers.referer.endsWith('/')
          ? req.headers.referer.slice(0, -1)
          : req.headers.referer
      }
      if (req.headers.origin === LOCALHOST_ORIGIN_TAURI) {
        return req.headers.origin
      }
      return process.env.FRONTEND_URL
    }
    default: {
      return process.env.FRONTEND_URL
    }
  }
}
function determineAllowCredentials(req) {
  switch (process.env.NODE_ENV) {
    case 'production': {
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req.headers?.referer &&
        req.headers.referer.includes('localhost')
      ) {
        return 'false'
      }
      return 'true'
    }
    default: {
      return 'true'
    }
  }
}
app.use(helmet())
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.setHeader('credentials', 'include')
  res.setHeader(
    'Access-Control-Allow-Credentials',
    determineAllowCredentials(req)
  )
  res.setHeader('Access-Control-Allow-Origin', determineAllowOrigin(req))
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.setHeader('Access-Control-Expose-Headers', ['set-cookie'])
  next()
})
app.use(express2.json())
google29.options({
  http2: true,
})
var swaggerDefinition = {
  info: {
    title: 'Juno API',
    version: '0.0.1',
    description:
      'This is a REST API application made with Express. It retrieves data from Gmail Api.',
    license: {
      name: 'Licensed under GNU General Public License v3.0',
      url: 'https://github.com/Elysium-Labs-EU/juno-backend/blob/main/LICENSE',
    },
    contact: {
      name: 'Robbert Tuerlings',
      url: 'https://robberttuerlings.online',
    },
  },
}
var swaggerOptions = {
  swaggerDefinition,
  apis: ['./index.ts', './doc/definitions.yaml'],
}
var swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
process.env.NODE_ENV !== 'development' && initSentry(app)
function rootHandler(req, res) {
  routes_default(req, res, () => {
    res.status(404).send('Page not found')
  })
}
app.use('/', rootHandler)
app.use(Sentry2.Handlers.requestHandler())
app.use(Sentry2.Handlers.tracingHandler())
app.use(
  Sentry2.Handlers.errorHandler({
    shouldHandleError(error) {
      const regex = /Redis/
      const isRedisError = regex.test(error.toString())
      console.log('Error detected by Sentry:', error)
      if (
        error.status === 401 ||
        error.status === 404 ||
        error.status === 500 ||
        isRedisError
      ) {
        return true
      }
      return false
    },
  })
)
app.use(function onError(err, req, res, next) {
  res.statusCode = 500
  res.end(res.sentry + '\n')
})
var app_default = app

// src/server.ts
var PORT = process.env.PORT || 5001
var server = http.createServer(app_default)
server.listen(PORT)
