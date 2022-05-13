var __create = Object.create
var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropNames = Object.getOwnPropertyNames
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value)
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
    }
  return a
}
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod
  )
)
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    var rejected = (value) => {
      try {
        step(generator.throw(value))
      } catch (e) {
        reject(e)
      }
    }
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected)
    step((generator = generator.apply(__this, __arguments)).next())
  })
}

// src/server.ts
var import_http = __toESM(require('http'))

// src/routes/app.ts
var import_express2 = __toESM(require('./node_modules/express/index.js'))
var import_config = require('./node_modules/dotenv/config.js')
var import_swagger_jsdoc = __toESM(
  require('./node_modules/swagger-jsdoc/index.js')
)
var import_swagger_ui_express = __toESM(
  require('./node_modules/swagger-ui-express/index.js')
)

// src/routes/index.ts
var import_express = __toESM(require('./node_modules/express/index.js'))

// src/controllers/Threads/fetchThreads.ts
var import_googleapis = require('./node_modules/googleapis/build/src/index.js')

// src/google/index.ts
var import_google_auth_library = require('./node_modules/google-auth-library/build/src/index.js')

// src/utils/assertNonNullish.ts
function assertNonNullish(value, message) {
  if (value === null || value === void 0) {
    throw Error(message)
  }
}

// src/constants/globalConstants.ts
var USER = 'me'
var INVALID_TOKEN = 'Invalid token'
var INVALID_SESSION = 'Invalid session'

// src/google/index.ts
var SCOPES = [
  'openid',
  'profile',
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.other.readonly',
]
var createAuthClientObject = () => {
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(
    process.env.GOOGLE_REDIRECT_URL,
    'No Google Redirect URL found'
  )
  return new import_google_auth_library.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}${process.env.GOOGLE_REDIRECT_URL}`
  )
}
var authorize = (_0) =>
  __async(void 0, [_0], function* ({ session: session2, requestAccessToken }) {
    if (
      requestAccessToken &&
      (session2 == null ? void 0 : session2.access_token) ===
        requestAccessToken.replace(/['"]+/g, '')
    ) {
      const oAuth2Client = createAuthClientObject()
      try {
        oAuth2Client.setCredentials(session2)
        return oAuth2Client
      } catch (err) {
        console.log('err', JSON.stringify(err))
      }
    } else {
      return INVALID_TOKEN
    }
  })
var authenticate = (_0) =>
  __async(void 0, [_0], function* ({ session: session2, requestAccessToken }) {
    try {
      if (typeof session2 !== 'undefined' && requestAccessToken) {
        const response = yield authorize({
          session: session2,
          requestAccessToken,
        })
        return response
      }
      console.log(session2, 'User session is invalid')
      return INVALID_SESSION
    } catch (err) {
      console.error(err)
    }
  })
var getauthenticateClient = (req, res) =>
  __async(void 0, null, function* () {
    try {
      const { code } = req.body
      if (code) {
        const oAuth2Client = createAuthClientObject()
        const response = yield oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(response.tokens)
        req.session.oAuthClient = oAuth2Client.credentials
        return res.status(200).json({
          access_token: oAuth2Client.credentials.access_token,
          refresh_token: oAuth2Client.credentials.refresh_token,
        })
      }
    } catch (err) {
      res.status(401).json(err)
      throw Error(err)
    }
  })
var getAuthUrl = (req, res) =>
  __async(void 0, null, function* () {
    try {
      const oAuth2Client = createAuthClientObject()
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      })
      return res.status(200).json(authorizeUrl)
    } catch (err) {
      res.status(401).json(err)
    }
  })

// src/controllers/Users/authenticateUser.ts
var authenticateUser = (req) =>
  __async(void 0, null, function* () {
    var _a, _b
    const response = yield authenticate({
      session: (_a = req.session) == null ? void 0 : _a.oAuthClient,
      requestAccessToken:
        (_b = req.headers) == null ? void 0 : _b.authorization,
    })
    if (response === INVALID_TOKEN) {
      throw Error(response)
    }
    if (response === INVALID_SESSION) {
      throw Error(response)
    }
    return response
  })

// src/middleware/authMiddleware.ts
var authMiddleware = (requestFunction) => (req, res) =>
  __async(void 0, null, function* () {
    try {
      const auth = yield authenticateUser(req)
      const response = yield requestFunction(auth, req)
      return res.status(200).json(response)
    } catch (err) {
      res.status(401).json(err.message)
    }
  })

// src/controllers/Threads/threadRequest.ts
var requestBodyCreator = (req) => {
  const requestBody = {
    userId: USER,
  }
  requestBody.maxResults =
    typeof Number(req.query.maxResults) !== 'number'
      ? 20
      : Number(req.query.maxResults)
  if (req.query.labelIds && req.query.labelIds !== 'undefined') {
    requestBody.labelIds = req.query.labelIds
  }
  if (req.query.pageToken) {
    requestBody.pageToken = req.query.pageToken
  }
  if (req.query.q) {
    requestBody.q = req.query.q
  }
  return requestBody
}
var threadRequest_default = requestBodyCreator

// src/controllers/Threads/fetchThreads.ts
var getThreads = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis.google.gmail({ version: 'v1', auth })
    const requestBody = threadRequest_default(req)
    try {
      const response = yield gmail.users.threads.list(requestBody)
      if (response && response.data) {
        return response.data
      }
      return new Error('No threads found...')
    } catch (err) {
      throw Error(`Threads returned an error: ${err}`)
    }
  })
var fetchThreads = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getThreads)(req, res)
  })

// src/controllers/Threads/fetchFullThreads.ts
var import_googleapis2 = require('./node_modules/googleapis/build/src/index.js')
function singleThread(thread, gmail) {
  return __async(this, null, function* () {
    const { id } = thread
    try {
      if (id) {
        const response = yield gmail.users.threads.get({
          userId: USER,
          id,
          format: 'full',
        })
        if (response && response.data) {
          return response.data
        }
      }
      throw Error('Thread not found...')
    } catch (err) {
      throw Error(`Threads returned an error: ${err}`)
    }
  })
}
var getFullThreads = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis2.google.gmail({ version: 'v1', auth })
    const requestBody = threadRequest_default(req)
    try {
      const response = yield gmail.users.threads.list(requestBody)
      if (response && response.data) {
        const hydrateMetaList = () =>
          __async(void 0, null, function* () {
            const results = []
            const threads = response.data.threads
            if (threads) {
              for (const thread of threads) {
                results.push(singleThread(thread, gmail))
              }
              const timeStampLastFetch = Date.now()
              return __spreadProps(__spreadValues({}, response.data), {
                threads: yield Promise.all(results),
                timestamp: timeStampLastFetch,
              })
            }
          })
        return hydrateMetaList()
      }
    } catch (err) {
      throw Error(`Threads returned an error: ${err}`)
    }
  })
var fetchFullThreads = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getFullThreads)(req, res)
  })

// src/controllers/Threads/fetchSingleThread.ts
var import_googleapis3 = require('./node_modules/googleapis/build/src/index.js')
var getThread = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis3.google.gmail({ version: 'v1', auth })
    const { id } = req.params
    try {
      const response = yield gmail.users.threads.get({
        userId: USER,
        id,
        format: 'full',
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('Thread not found...')
    } catch (err) {
      throw Error(`Threads returned an error: ${err}`)
    }
  })
var fetchSingleThread = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getThread)(req, res)
  })

// src/controllers/Drafts/createDraft.ts
var import_googleapis4 = require('./node_modules/googleapis/build/src/index.js')

// src/utils/messageEncoding.ts
var messageEncoding = (props) => {
  const { body, subject, to, cc, bcc, sender } = props
  const utf8Subject = `=?utf-8?B?${Buffer.from(
    subject != null ? subject : ''
  ).toString('base64')}?=`
  const messageParts = [
    `From: ${sender}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `${body}`,
  ]
  const message = messageParts.join('\n')
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return encodedMessage
}
var messageEncoding_default = messageEncoding

// src/controllers/Drafts/createDraft.ts
var setupDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis4.google.gmail({ version: 'v1', auth })
    const { threadId, messageId, labelIds } = req.body
    try {
      const response = yield gmail.users.drafts.create({
        userId: USER,
        requestBody: {
          message: {
            raw: messageEncoding_default(req.body),
            id: messageId,
            threadId,
            labelIds,
            payload: {
              partId: '',
              mimeType: 'text/html',
              filename: '',
              body: {
                data: messageEncoding_default(req.body),
              },
            },
          },
        },
      })
      if (response) {
        return response
      }
      return new Error('Draft is not created...')
    } catch (err) {
      throw Error(`Create Draft returned an error ${err}`)
    }
  })
var createDraft = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(setupDraft)(req, res)
  })

// src/controllers/Drafts/fetchDrafts.ts
var import_googleapis5 = require('./node_modules/googleapis/build/src/index.js')
var getDrafts = (auth) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis5.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.drafts.list({
        userId: USER,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('No drafts found...')
    } catch (err) {
      throw Error(`Drafts returned an error: ${err}`)
    }
  })
var fetchDrafts = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getDrafts)(req, res)
  })

// src/controllers/Drafts/fetchSingleDraft.ts
var import_googleapis6 = require('./node_modules/googleapis/build/src/index.js')
var getDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis6.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.drafts.get({
        userId: USER,
        id: req.params.id,
        format: 'full',
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('Draft not found...')
    } catch (err) {
      throw Error(`Fetching Draft returned an error ${err}`)
    }
  })
var fetchSingleDraft = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getDraft)(req, res)
  })

// src/controllers/Drafts/sendDraft.ts
var import_googleapis7 = require('./node_modules/googleapis/build/src/index.js')
var exportDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis7.google.gmail({ version: 'v1', auth })
    const { id } = req.body
    try {
      const response = yield gmail.users.drafts.send({
        userId: USER,
        requestBody: {
          id,
        },
      })
      if (response) {
        return response
      }
      return new Error('Mail was not sent...')
    } catch (err) {
      throw Error(`Sending Draft encountered an error ${err}`)
    }
  })
var sendDraft = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(exportDraft)(req, res)
  })

// src/controllers/Drafts/updateDraft.ts
var import_googleapis8 = require('./node_modules/googleapis/build/src/index.js')
var exportDraft2 = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis8.google.gmail({ version: 'v1', auth })
    const { draftId, threadId, messageId, labelIds } = req.body
    try {
      const response = yield gmail.users.drafts.update({
        userId: USER,
        id: draftId,
        requestBody: {
          message: {
            raw: messageEncoding_default(req.body),
            id: messageId,
            threadId,
            labelIds,
            payload: {
              partId: '',
              mimeType: 'text/html',
              filename: '',
              body: {
                data: messageEncoding_default(req.body),
              },
            },
          },
        },
      })
      if (response) {
        return response
      }
      return new Error('Draft is not updated...')
    } catch (err) {
      throw Error(`Draft update encountered an error ${err}`)
    }
  })
var updateDraft = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(exportDraft2)(req, res)
  })

// src/controllers/Drafts/deleteDraft.ts
var import_googleapis9 = require('./node_modules/googleapis/build/src/index.js')
var removeDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis9.google.gmail({ version: 'v1', auth })
    const {
      body: { id },
    } = req
    try {
      const response = yield gmail.users.drafts.delete({
        userId: USER,
        id,
      })
      return response
    } catch (err) {
      throw Error(`Draft returned an error: ${err}`)
    }
  })
var deleteDraft = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(removeDraft)(req, res)
  })

// src/controllers/Message/updateSingleMessage.ts
var import_googleapis10 = require('./node_modules/googleapis/build/src/index.js')
var updateMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis10.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.threads.modify({
        userId: USER,
        id: req.params.id,
        requestBody: req.body,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('Message not found...')
    } catch (err) {
      throw Error(`Single message returned an error: ${err}`)
    }
  })
var updateSingleMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(updateMessage)(req, res)
  })

// src/controllers/Message/thrashSingleMessage.ts
var import_googleapis11 = require('./node_modules/googleapis/build/src/index.js')
var thrashMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis11.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.threads.trash({
        userId: USER,
        id: req.params.id,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('No message found...')
    } catch (err) {
      throw Error(`Single message return an error: ${err}`)
    }
  })
var thrashSingleMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(thrashMessage)(req, res)
  })

// src/controllers/Message/deleteSingleMessage.ts
var import_googleapis12 = require('./node_modules/googleapis/build/src/index.js')
var deleteMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis12.google.gmail({ version: 'v1', auth })
    const {
      body: { id },
    } = req
    try {
      const response = yield gmail.users.threads.delete({
        userId: USER,
        id,
      })
      return response
    } catch (err) {
      throw Error('Message not removed...')
    }
  })
var deleteSingleMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(deleteMessage)(req, res)
  })

// src/controllers/Message/fetchMessageAttachment.ts
var import_googleapis13 = require('./node_modules/googleapis/build/src/index.js')
var getAttachment = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis13.google.gmail({ version: 'v1', auth })
    const { messageId } = req.params
    const attachmentId = req.params.id
    try {
      const response = yield gmail.users.messages.attachments.get({
        userId: USER,
        messageId,
        id: attachmentId,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('Message attachment not found...')
    } catch (err) {
      throw Error(`Get Attachment returned an error: ${err}`)
    }
  })
var fetchMessageAttachment = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getAttachment)(req, res)
  })

// src/controllers/Message/sendMessage.ts
var import_googleapis14 = require('./node_modules/googleapis/build/src/index.js')
var exportMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis14.google.gmail({ version: 'v1', auth })
    const { id, threadId } = req.body
    try {
      const response = yield gmail.users.messages.send({
        userId: USER,
        requestBody: {
          raw: messageEncoding_default(req.body),
          id,
          threadId,
        },
      })
      if (response) {
        return response
      }
      return new Error('Mail was not sent...')
    } catch (err) {
      throw Error(`Mail was not sent...: ${err}`)
    }
  })
var sendMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(exportMessage)(req, res)
  })

// src/controllers/Labels/createLabels.ts
var import_googleapis15 = require('./node_modules/googleapis/build/src/index.js')
var newLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis15.google.gmail({ version: 'v1', auth })
    try {
      const {
        body: { labelListVisibility, messageListVisibility, name },
      } = req
      const response = gmail.users.labels.create({
        userId: USER,
        requestBody: {
          labelListVisibility,
          messageListVisibility,
          name,
        },
      })
      return response
    } catch (err) {
      throw Error(`Create labels returned an error: ${err}`)
    }
  })
var createLabels = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(newLabels)(req, res)
  })

// src/controllers/Labels/fetchLabels.ts
var import_googleapis16 = require('./node_modules/googleapis/build/src/index.js')
var getLabels = (auth) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis16.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.labels.list({
        userId: USER,
      })
      if (response == null ? void 0 : response.data) {
        return response.data
      }
      return new Error('No Labels found...')
    } catch (err) {
      throw Error(`Labels returned an error: ${err}`)
    }
  })
var fetchLabels = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getLabels)(req, res)
  })

// src/controllers/Labels/fetchSingleLabel.ts
var import_googleapis17 = require('./node_modules/googleapis/build/src/index.js')
var getLabel = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis17.google.gmail({ version: 'v1', auth })
    const { id } = req.params
    try {
      const response = yield gmail.users.labels.get({
        userId: USER,
        id,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('No Label found...')
    } catch (err) {
      throw Error(`Label returned an error: ${err}`)
    }
  })
var fetchSingleLabel = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getLabel)(req, res)
  })

// src/controllers/Labels/updateLabels.ts
var import_googleapis18 = require('./node_modules/googleapis/build/src/index.js')
var refreshLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis18.google.gmail({ version: 'v1', auth })
    const {
      body: { id, requestBody },
    } = req
    try {
      const response = yield gmail.users.labels.patch({
        userId: USER,
        id,
        requestBody,
      })
      if (response && response.data) {
        return response.data
      }
      return new Error('No labels created...')
    } catch (err) {
      throw new Error(`Create labels returned an error: ${err}`)
    }
  })
var updateLabels = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(refreshLabels)(req, res)
  })

// src/controllers/Labels/removeLabels.ts
var import_googleapis19 = require('./node_modules/googleapis/build/src/index.js')
var removeTheLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis19.google.gmail({ version: 'v1', auth })
    const {
      body: { id },
    } = req
    try {
      const response = yield gmail.users.labels.delete({
        userId: USER,
        id,
      })
      return response
    } catch (err) {
      throw Error(`Create labels returned an error: ${err}`)
    }
  })
var removeLabels = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(removeTheLabels)(req, res)
  })

// src/controllers/Users/getProfile.ts
var import_googleapis20 = require('./node_modules/googleapis/build/src/index.js')
var fetchProfile = (auth) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis20.google.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.getProfile({
        userId: USER,
      })
      if ((response == null ? void 0 : response.status) === 200) {
        return response.data
      }
      return new Error('No Profile found...')
    } catch (err) {
      throw Error(`Profile returned an error: ${err}`)
    }
  })
var getProfile = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(fetchProfile)(req, res)
  })

// src/controllers/Contacts/fetchAllContacts.ts
var import_googleapis21 = require('./node_modules/googleapis/build/src/index.js')
var getContacts = (auth, req) =>
  __async(void 0, null, function* () {
    const people = import_googleapis21.google.people({ version: 'v1', auth })
    const requestBody = {}
    requestBody.pageSize =
      typeof Number(req.query.pageSize) !== 'number'
        ? 1e3
        : Number(req.query.pageSize)
    if (req.query.readMask) {
      requestBody.readMask = req.query.readMask
    }
    if (req.query.pageToken) {
      requestBody.pageToken = req.query.pageToken
    }
    try {
      const response = yield people.otherContacts.list(requestBody)
      if (response && response.data) {
        return response.data
      }
      return new Error('No contacts found...')
    } catch (err) {
      throw Error(`Contacts returned an error: ${err}`)
    }
  })
var fetchAllContacts = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getContacts)(req, res)
  })

// src/controllers/Contacts/queryContacts.ts
var import_googleapis22 = require('./node_modules/googleapis/build/src/index.js')
var getContacts2 = (auth, req) =>
  __async(void 0, null, function* () {
    const people = import_googleapis22.google.people({ version: 'v1', auth })
    const requestBody = {}
    requestBody.query = req.query.query
    requestBody.readMask = req.query.readMask
    try {
      const response = yield people.otherContacts.search(requestBody)
      if (response && response.data) {
        return response.data
      }
      return new Error('No contacts found...')
    } catch (err) {
      throw Error(`Contacts returned an error: ${err}`)
    }
  })
var queryContacts = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getContacts2)(req, res)
  })

// src/controllers/History/listHistory.ts
var import_googleapis23 = require('./node_modules/googleapis/build/src/index.js')
var fetchHistory = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = import_googleapis23.google.gmail({ version: 'v1', auth })
    try {
      const { startHistoryId } = req.query
      const response = yield gmail.users.history.list({
        userId: USER,
        startHistoryId,
      })
      if (response && response.status === 200) {
        return response.data
      }
      return new Error('No history found...')
    } catch (err) {
      throw Error(`Profile returned an error: ${err}`)
    }
  })
var listHistory = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(fetchHistory)(req, res)
  })

// src/controllers/Users/logoutUser.ts
var logoutUser = (req, res) =>
  __async(void 0, null, function* () {
    try {
      if (req.headers.authorization) {
        req.session.destroy(function (err) {
          if (err) {
            console.log(err)
            return res.status(401).json(err.message)
          }
          return res.status(205).json()
        })
      }
    } catch (err) {
      res.status(401).json(err.message)
    }
  })

// src/controllers/health.ts
var health = (req, res) =>
  __async(void 0, null, function* () {
    try {
      const response = 'I am healthy.'
      return res.status(200).json(response)
    } catch (err) {
      const errResponse = 'I am unhealthy.'
      res.status(401).json(errResponse)
    }
  })

// src/routes/index.ts
var router = import_express.default.Router()
router.get(
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',
  fetchAllContacts
)
router.get('/api/contact/search/:query?/:readMask?', queryContacts)
router.get(
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?',
  fetchFullThreads
)
router.get('/api/threads/:labelIds?/:maxResults?/:nextPageToken?', fetchThreads)
router.get('/api/thread/:id?', fetchSingleThread)
router.post('/api/create-draft', createDraft)
router.get('/api/drafts/:maxResults?/:nextPageToken?', fetchDrafts)
router.get('/api/draft/:id?', fetchSingleDraft)
router.delete('/api/draft/', deleteDraft)
router.post('/api/send-draft', sendDraft)
router.put('/api/update-draft/?:id?', updateDraft)
router.patch('/api/message/:id?', updateSingleMessage)
router.post('/api/message/thrash/:id?', thrashSingleMessage)
router.delete('/api/message/', deleteSingleMessage)
router.get('/api/message/attachment/:messageId?/:id?', fetchMessageAttachment)
router.post('/api/send-message', sendMessage)
router.post('/api/labels', createLabels)
router.get('/api/labels', fetchLabels)
router.get('/api/label/:id?', fetchSingleLabel)
router.patch('/api/labels', updateLabels)
router.delete('/api/labels', removeLabels)
router.get('/api/auth/oauth/google/', getAuthUrl)
router.post('/api/auth/oauth/google/callback/', getauthenticateClient)
router.get('/api/user', getProfile)
router.get('/api/user/logout', logoutUser)
router.get('/api/history/:startHistoryId?', listHistory)
router.get('/api/health', health)
var routes_default = router

// src/routes/app.ts
var Sentry = __toESM(require('./node_modules/@sentry/node/dist/index.js'))
var Tracing = __toESM(require('./node_modules/@sentry/tracing/dist/index.js'))
var import_express_session = __toESM(
  require('./node_modules/express-session/index.js')
)
var import_connect_redis = __toESM(
  require('./node_modules/connect-redis/index.js')
)

// src/data/redis.ts
var import_redis = require('./node_modules/redis/dist/index.js')
var initiateRedis = () => {
  assertNonNullish(process.env.REDIS_PORT, 'No Redis Port defined')
  const redisClient2 =
    process.env.REDIS_MODE === 'development'
      ? (0, import_redis.createClient)({
          legacyMode: true,
        })
      : (0, import_redis.createClient)({
          username: process.env.REDIS_USER,
          password: process.env.REDIS_PASS,
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          },
          legacyMode: true,
        })
  redisClient2.connect().catch(console.error)
  return redisClient2
}
var redis_default = initiateRedis

// src/routes/app.ts
process.env.NODE_ENV !== 'production' && console.log('Booted')
var app = (0, import_express2.default)()
var redisStore = (0, import_connect_redis.default)(
  import_express_session.default
)
var redisClient = redis_default()
assertNonNullish(process.env.SESSION_SECRET, 'No Session Secret.')
assertNonNullish(process.env.COOKIE_DOMAIN, 'No Cookie Domain.')
app.use(
  (0, import_express_session.default)({
    store: new redisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 1e3 * 60 * 10080,
    },
  })
)
app.use((req, res, next) => {
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
app.use(import_express2.default.json())
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
var swaggerDocs = (0, import_swagger_jsdoc.default)(swaggerOptions)
app.use(
  '/swagger',
  import_swagger_ui_express.default.serve,
  import_swagger_ui_express.default.setup(swaggerDocs)
)
process.env.SENTRY_DSN &&
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1,
  })
app.use('/', routes_default)
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())
app.use(Sentry.Handlers.errorHandler())
app.use(function onError(err, req, res, next) {
  res.statusCode = 500
  res.end(res.sentry + '\n')
})
var app_default = app

// src/server.ts
var PORT = process.env.PORT || 5001
var server = import_http.default.createServer(app_default)
server.listen(PORT)
