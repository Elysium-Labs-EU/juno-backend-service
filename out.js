var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropSymbols = Object.getOwnPropertySymbols
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
import http from 'http'

// src/routes/app.ts
import express2 from './node_modules/express/index.js'
import './node_modules/dotenv/config.js'
import swaggerJSDoc from './node_modules/swagger-jsdoc/index.js'
import swaggerUI from './node_modules/swagger-ui-express/index.js'

// src/routes/index.ts
import express from './node_modules/express/index.js'

// src/controllers/Threads/fetchSimpleThreads.ts
import { google } from './node_modules/googleapis/build/src/index.js'

// src/constants/globalConstants.ts
var USER = 'me'
var INVALID_TOKEN = 'Invalid token'
var INVALID_SESSION = 'Invalid session'
var MIME_TYPE_NO_INLINE = 'application/octet-stream'

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

// src/google/index.ts
import { OAuth2Client } from './node_modules/google-auth-library/build/src/index.js'

// src/utils/assertNonNullish.ts
function assertNonNullish(value, message) {
  if (value === null || value === void 0) {
    throw Error(message)
  }
}

// src/google/index.ts
var SCOPES = [
  'openid',
  'profile',
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
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
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}${process.env.GOOGLE_REDIRECT_URL}`
  )
}
var authorize = (_0) =>
  __async(void 0, [_0], function* ({ session: session2 }) {
    if (session2) {
      const oAuth2Client = createAuthClientObject()
      try {
        oAuth2Client.setCredentials(session2)
        return oAuth2Client
      } catch (err) {
        return 'Error during authorization'
        console.log('err', JSON.stringify(err))
      }
    } else {
      return INVALID_TOKEN
    }
  })
var authenticate = (_0) =>
  __async(void 0, [_0], function* ({ session: session2, idToken }) {
    try {
      if (
        typeof session2 !== 'undefined' &&
        idToken &&
        (yield checkIdValidity(idToken))
      ) {
        const response = yield authorize({ session: session2 })
        return response
      }
      return INVALID_SESSION
    } catch (err) {
      console.error(err)
    }
  })
var getAuthenticateClient = (req, res) =>
  __async(void 0, null, function* () {
    try {
      const { code } = req.body
      if (code) {
        const oAuth2Client = createAuthClientObject()
        const response = yield oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(response.tokens)
        req.session.oAuthClient = oAuth2Client.credentials
        const idToken = oAuth2Client.credentials.id_token
        if (idToken) {
          return res.status(200).json({
            idToken: idToken.replace(/['"]+/g, ''),
          })
        } else {
          return res.status(400).json('Id Token not found')
        }
      }
    } catch (err) {
      process.env.NODE_ENV === 'development' && console.log('ERROR', err)
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
var checkIdValidity = (token) =>
  __async(void 0, null, function* () {
    const oAuth2Client = createAuthClientObject()
    try {
      yield oAuth2Client.verifyIdToken({
        idToken: token.replace(/['"]+/g, ''),
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  })

// src/controllers/Users/authenticateUser.ts
var authenticateUser = (req) =>
  __async(void 0, null, function* () {
    var _a, _b
    const response = yield authenticate({
      session: (_a = req.session) == null ? void 0 : _a.oAuthClient,
      idToken: (_b = req.headers) == null ? void 0 : _b.authorization,
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
  })

// src/middleware/authMiddleware.ts
var authMiddleware = (requestFunction) => (req, res) =>
  __async(void 0, null, function* () {
    try {
      const auth = yield authenticateUser(req)
      const response = yield requestFunction(auth, req)
      return res.status(200).json(response)
    } catch (err) {
      process.env.NODE_ENV !== 'production' && console.error(err)
      res.status(401).json(err == null ? void 0 : err.message)
    }
  })

// src/utils/fetchAttachments.ts
var foundAttachments = []
var loopThroughParts = ({ input, reset = false }) => {
  var _a, _b
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
        ((_b = (_a = input[i]) == null ? void 0 : _a.headers) == null
          ? void 0
          : _b.find((header) => {
              var _a2
              return (_a2 = header == null ? void 0 : header.name) == null
                ? void 0
                : _a2.includes('Content-Disposition')
            }))
      ) {
        foundAttachments.push(input[i])
      }
    }
  }
  return foundAttachments
}
function checkAttachment(message) {
  var _a, _b
  if (
    Object.prototype.hasOwnProperty.call(
      message == null ? void 0 : message.payload,
      'parts'
    )
  ) {
    const parts =
      (_b =
        (_a = message == null ? void 0 : message.payload) == null
          ? void 0
          : _a.parts) == null
        ? void 0
        : _b.filter((item) => item !== void 0)
    return loopThroughParts({ input: parts, reset: true })
  }
  return []
}

// src/utils/findHeader.ts
function findHeader(rawMessage, query) {
  var _a, _b, _c, _d, _e, _f
  if (
    ((_a = rawMessage == null ? void 0 : rawMessage.payload) == null
      ? void 0
      : _a.headers) &&
    ((_c =
      (_b = rawMessage == null ? void 0 : rawMessage.payload) == null
        ? void 0
        : _b.headers) == null
      ? void 0
      : _c.find((e) => e.name === query))
  ) {
    return (_d = rawMessage.payload.headers.find((e) => e.name === query)) ==
      null
      ? void 0
      : _d.value
  }
  if (
    ((_e = rawMessage == null ? void 0 : rawMessage.payload) == null
      ? void 0
      : _e.headers) &&
    rawMessage.payload.headers.find((e) => e.name === query.toLowerCase())
  ) {
    return (_f = rawMessage.payload.headers.find(
      (e) => e.name === query.toLowerCase()
    )) == null
      ? void 0
      : _f.value
  }
}

// src/utils/threadSimpleRemap.ts
var remapPayloadHeaders = (rawMessage) => {
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
var remapSimpleMessage = (rawMessage) =>
  __async(void 0, null, function* () {
    var _a
    return {
      id: rawMessage.id,
      threadId: rawMessage.threadId,
      labelIds: rawMessage.labelIds,
      snippet: rawMessage.snippet,
      payload: {
        mimeType:
          (_a = rawMessage == null ? void 0 : rawMessage.payload) == null
            ? void 0
            : _a.mimeType,
        headers: remapPayloadHeaders(rawMessage),
        files: checkAttachment(rawMessage),
      },
      sizeEstimate: rawMessage.sizeEstimate,
      historyId: rawMessage.historyId,
      internalDate: rawMessage.internalDate,
    }
  })
function threadSimpleRemap(rawObject) {
  return __async(this, null, function* () {
    if (rawObject.messages) {
      const mappedMessages = rawObject.messages.map((message) =>
        remapSimpleMessage(message)
      )
      return {
        id: rawObject.id,
        historyId: rawObject.historyId,
        messages: yield Promise.all(mappedMessages),
      }
    }
    return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
  })
}

// src/controllers/Threads/fetchSimpleThreads.ts
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
var getSimpleThreads = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google.gmail({ version: 'v1', auth })
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
              const fetchedThreads = yield Promise.all(results)
              return __spreadProps(__spreadValues({}, response.data), {
                threads: yield Promise.all(
                  fetchedThreads.map((thread) => threadSimpleRemap(thread))
                ),
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
var fetchSimpleThreads = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(getSimpleThreads)(req, res)
  })

// src/controllers/Threads/fetchFullThreads.ts
import { google as google2 } from './node_modules/googleapis/build/src/index.js'

// src/utils/bodyDecoder.ts
import * as cheerio3 from './node_modules/cheerio/lib/esm/index.js'
import AutoLinker from './node_modules/autolinker/dist/commonjs/index.js'

// src/utils/removeTrackers.ts
import * as cheerio from './node_modules/cheerio/lib/esm/index.js'
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
      .map((item) => {
        var _a
        return (_a = item.value) == null ? void 0 : _a.split(/\s*;\s*/g)
      })
      .flat(1)
    for (let i = 0; parsedStyle.length > i; i += 1) {
      if (parsedStyle[i]) {
        const parts = parsedStyle[i].match(/^([^:]+)\s*:\s*(.+)/)
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
  const localCopyOrderedObject = __spreadProps(
    __spreadValues({}, orderedObject),
    { removedTrackers: [] }
  )
  const $ = cheerio.load(orderedObject.emailHTML)
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
      const srcOfTracker =
        documentImage == null
          ? void 0
          : documentImage.attributes.filter(
              (attribute) => attribute.name === 'src'
            )[0]
      if (srcOfTracker) {
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

// src/utils/removeScripts.ts
import * as cheerio2 from './node_modules/cheerio/lib/esm/index.js'
function removeScripts(orderedObject) {
  const $ = cheerio2.load(orderedObject.emailHTML)
  $('script').each((_, foundScript) => {
    $(foundScript).remove()
  })
  return orderedObject
}

// src/utils/bodyDecoder.ts
var decodedString
var localMessageId
var decodedResult = []
var localGmail = null
var enhancePlainText = (localString) => {
  const enhancedText = () => {
    var _a
    const lineBreakRegex = /(?:\r\n|\r|\n)/g
    return (_a = AutoLinker.link(localString, { email: false }).replace(
      lineBreakRegex,
      '<br>'
    )) != null
      ? _a
      : ''
  }
  return enhancedText()
}
var inlineImageDecoder = (_0) =>
  __async(void 0, [_0], function* ({ attachmentData, messageId }) {
    var _a, _b
    const { body, filename, mimeType, headers } = attachmentData
    const getAttachment2 = () =>
      __async(void 0, null, function* () {
        if (localGmail && (body == null ? void 0 : body.attachmentId)) {
          try {
            const response2 = yield localGmail.users.messages.attachments.get({
              userId: USER,
              messageId,
              id: body == null ? void 0 : body.attachmentId,
            })
            if (response2 && response2.data) {
              return response2.data
            }
            return 'Message attachment not found...'
          } catch (err) {
            throw Error(`Get Attachment returned an error: ${err}`)
          }
        }
      })
    const response = yield getAttachment2()
    if (
      response &&
      typeof response !== 'string' &&
      (response == null ? void 0 : response.data)
    ) {
      const decodedB64 = baseBase64(response.data)
      const contentID =
        (_b =
          (_a =
            headers == null
              ? void 0
              : headers.find(
                  (e) => e.name === 'Content-ID' || e.name === 'Content-Id'
                )) == null
            ? void 0
            : _a.value) == null
          ? void 0
          : _b.replace(/<|>/gi, '')
      if (contentID) {
        const attachment = {
          mimeType,
          decodedB64,
          filename,
          contentID,
        }
        return attachment
      }
    }
    return 'Message attachment not found...'
  })
var loopThroughBodyParts = (_0) =>
  __async(void 0, [_0], function* ({ inputObject, signal }) {
    if (signal == null ? void 0 : signal.aborted) {
      throw new Error('Decoding aborted')
    }
    const loopingFunction = (_02) =>
      __async(void 0, [_02], function* ({ loopObject }) {
        var _a, _b, _c, _d, _e
        try {
          const objectKeys = Object.keys(loopObject)
          for (const objectKey of objectKeys) {
            if (objectKey === 'body') {
              if (
                ((_a = loopObject == null ? void 0 : loopObject.body) == null
                  ? void 0
                  : _a.size) &&
                ((_b = loopObject == null ? void 0 : loopObject.body) == null
                  ? void 0
                  : _b.size) > 0
              ) {
                if (
                  ((_c = loopObject.body) == null ? void 0 : _c.attachmentId) &&
                  localMessageId
                ) {
                  const imageObjectPromise = inlineImageDecoder({
                    attachmentData: loopObject,
                    messageId: localMessageId,
                  })
                  if (imageObjectPromise) {
                    decodedResult.push(imageObjectPromise)
                  }
                }
                decodedString = decodeBase64(
                  `${
                    (_d = loopObject == null ? void 0 : loopObject.body) == null
                      ? void 0
                      : _d.data
                  }`
                )
                if (loopObject.mimeType !== 'text/plain' && decodedString) {
                  decodedResult.push(decodedString)
                } else if (
                  loopObject.mimeType === 'text/plain' &&
                  decodedString
                ) {
                  const localString = decodedString
                  const check = enhancePlainText(localString)
                  decodedResult.push(check)
                }
              }
            }
            if (objectKey === 'parts') {
              if (
                (((_e = loopObject == null ? void 0 : loopObject.body) == null
                  ? void 0
                  : _e.size) === 0 ||
                  !Object.prototype.hasOwnProperty.call(loopObject, 'body')) &&
                (loopObject == null ? void 0 : loopObject.parts)
              ) {
                loopObject.parts.forEach((part) => {
                  loopingFunction({
                    loopObject: part,
                  })
                })
              }
            }
          }
          if (!(signal == null ? void 0 : signal.aborted)) {
            const result = yield Promise.all(decodedResult)
            return result
          }
          return null
        } catch (err) {
          decodedResult = []
          return err
        }
      })
    return loopingFunction({ loopObject: inputObject })
  })
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
  if (response.emailHTML.length === 1) {
    return __spreadProps(__spreadValues({}, response), {
      emailHTML: response.emailHTML[0],
    })
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
    return __spreadProps(__spreadValues({}, response), {
      emailHTML: htmlObject,
    })
  }
  return __spreadProps(__spreadValues({}, response), {
    emailHTML: noHtmlObject,
  })
}
var placeInlineImage = (orderedObject) => {
  if (orderedObject.emailFileHTML.length > 0) {
    const processedObjectArray = []
    const $ = cheerio3.load(orderedObject.emailHTML)
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
var bodyDecoder = (_0) =>
  __async(void 0, [_0], function* ({ messageId, inputObject, signal, gmail }) {
    try {
      if (inputObject) {
        if (messageId) {
          localMessageId = messageId
        }
        if (gmail) {
          localGmail = gmail
        }
        const response = yield loopThroughBodyParts({
          inputObject,
          signal,
        })
        decodedResult = []
        const ordered = orderArrayPerType(response)
        const prioritized = prioritizeHTMLbodyObject(ordered)
        const inlinedImages = placeInlineImage(prioritized)
        const removedTrackers = removeTrackers(inlinedImages)
        const removedScript = removeScripts(removedTrackers)
        return removedScript
      }
      return { emailHTML: '', emailFileHTML: [] }
    } catch (err) {
      return err
    }
  })
var bodyDecoder_default = bodyDecoder

// src/utils/threadFullRemap.ts
function handleListUnsubscribe(unsubscribeLink) {
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
var remapPayloadHeaders2 = (rawMessage) => {
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
var remapFullMessage = (rawMessage, gmail) =>
  __async(void 0, null, function* () {
    return {
      id: rawMessage.id,
      threadId: rawMessage.threadId,
      labelIds: rawMessage.labelIds,
      snippet: rawMessage.snippet,
      payload: __spreadProps(__spreadValues({}, rawMessage.payload), {
        headers: remapPayloadHeaders2(rawMessage),
        body: yield bodyDecoder_default({
          inputObject: rawMessage.payload,
          messageId: rawMessage == null ? void 0 : rawMessage.id,
          gmail,
        }),
      }),
      sizeEstimate: rawMessage.sizeEstimate,
      historyId: rawMessage.historyId,
      internalDate: rawMessage.internalDate,
    }
  })
function threadFullRemap(rawObject, gmail) {
  return __async(this, null, function* () {
    if (rawObject.messages) {
      const mappedMessages = rawObject.messages.map((message) =>
        remapFullMessage(message, gmail)
      )
      return {
        id: rawObject.id,
        historyId: rawObject.historyId,
        messages: yield Promise.all(mappedMessages),
      }
    }
    return { id: rawObject.id, historyId: rawObject.historyId, messages: [] }
  })
}

// src/controllers/Threads/fetchFullThreads.ts
function singleThread2(thread, gmail) {
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
    const gmail = google2.gmail({ version: 'v1', auth })
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
                results.push(singleThread2(thread, gmail))
              }
              const timeStampLastFetch = Date.now()
              const fetchedThreads = yield Promise.all(results)
              return __spreadProps(__spreadValues({}, response.data), {
                threads: yield Promise.all(
                  fetchedThreads.map((thread) => threadFullRemap(thread, gmail))
                ),
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
import { google as google3 } from './node_modules/googleapis/build/src/index.js'
var getThread = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google3.gmail({ version: 'v1', auth })
    const { id } = req.params
    try {
      const response = yield gmail.users.threads.get({
        userId: USER,
        id,
        format: 'full',
      })
      if (response && response.data) {
        const expandedResponse = yield threadFullRemap(response.data, gmail)
        return expandedResponse
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
import { google as google4 } from './node_modules/googleapis/build/src/index.js'

// src/utils/messageEncoding.ts
var messageEncoding = ({ body, subject, to, cc, bcc, signature }) => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(
    subject != null ? subject : ''
  ).toString('base64')}?=`
  const messageParts = [
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `${body}`,
    `${signature && signature.length > 0 && signature}`,
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
    const gmail = google4.gmail({ version: 'v1', auth })
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
import { google as google5 } from './node_modules/googleapis/build/src/index.js'
var getDrafts = (auth) =>
  __async(void 0, null, function* () {
    const gmail = google5.gmail({ version: 'v1', auth })
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
import { google as google6 } from './node_modules/googleapis/build/src/index.js'
var getDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google6.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.drafts.get({
        userId: USER,
        id: req.params.id,
        format: 'full',
      })
      if (response && response.data) {
        const decodedResult2 = yield remapFullMessage(
          response.data.message,
          gmail
        )
        return { id: response.data.id, message: decodedResult2 }
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
import { google as google7 } from './node_modules/googleapis/build/src/index.js'
var exportDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google7.gmail({ version: 'v1', auth })
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
import { google as google8 } from './node_modules/googleapis/build/src/index.js'
var exportDraft2 = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google8.gmail({ version: 'v1', auth })
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
      if ((response == null ? void 0 : response.status) === 200) {
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
import { google as google9 } from './node_modules/googleapis/build/src/index.js'
var removeDraft = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google9.gmail({ version: 'v1', auth })
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

// src/controllers/Message/updateMessage.ts
import { google as google10 } from './node_modules/googleapis/build/src/index.js'
var modifyMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google10.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.messages.modify({
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
var updateMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(modifyMessage)(req, res)
  })

// src/controllers/Message/thrashMessage.ts
import { google as google11 } from './node_modules/googleapis/build/src/index.js'
var thrashSingleMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google11.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.messages.trash({
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
var thrashMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(thrashSingleMessage)(req, res)
  })

// src/controllers/Message/deleteMessage.ts
import { google as google12 } from './node_modules/googleapis/build/src/index.js'
var deleteSingleMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google12.gmail({ version: 'v1', auth })
    const {
      body: { id },
    } = req
    try {
      const response = yield gmail.users.messages.delete({
        userId: USER,
        id,
      })
      return response
    } catch (err) {
      throw Error('Message not removed...')
    }
  })
var deleteMessage = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(deleteSingleMessage)(req, res)
  })

// src/controllers/Message/fetchMessageAttachment.ts
import { google as google13 } from './node_modules/googleapis/build/src/index.js'
var getAttachment = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google13.gmail({ version: 'v1', auth })
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
import { google as google14 } from './node_modules/googleapis/build/src/index.js'
var exportMessage = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google14.gmail({ version: 'v1', auth })
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
import { google as google15 } from './node_modules/googleapis/build/src/index.js'
var newLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google15.gmail({ version: 'v1', auth })
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
import { google as google16 } from './node_modules/googleapis/build/src/index.js'
var getLabels = (auth) =>
  __async(void 0, null, function* () {
    const gmail = google16.gmail({ version: 'v1', auth })
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
import { google as google17 } from './node_modules/googleapis/build/src/index.js'
var getLabel = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google17.gmail({ version: 'v1', auth })
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
import { google as google18 } from './node_modules/googleapis/build/src/index.js'
var refreshLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google18.gmail({ version: 'v1', auth })
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
import { google as google19 } from './node_modules/googleapis/build/src/index.js'
var removeTheLabels = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google19.gmail({ version: 'v1', auth })
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
import { google as google20 } from './node_modules/googleapis/build/src/index.js'
import jwt from './node_modules/jsonwebtoken/index.js'
var fetchProfile = (auth) =>
  __async(void 0, null, function* () {
    const gmail = google20.gmail({ version: 'v1', auth })
    try {
      const response = yield gmail.users.getProfile({
        userId: USER,
      })
      const decodedJWT = jwt.decode(auth.credentials.id_token)
      if (
        decodedJWT &&
        typeof decodedJWT !== 'string' &&
        (response == null ? void 0 : response.status) === 200
      ) {
        return __spreadValues(
          {
            name: decodedJWT.name,
            picture: decodedJWT.picture,
          },
          response.data
        )
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
import { google as google21 } from './node_modules/googleapis/build/src/index.js'
var getContacts = (auth, req) =>
  __async(void 0, null, function* () {
    const people = google21.people({ version: 'v1', auth })
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
import { google as google22 } from './node_modules/googleapis/build/src/index.js'
var getContacts2 = (auth, req) =>
  __async(void 0, null, function* () {
    const people = google22.people({ version: 'v1', auth })
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
import { google as google23 } from './node_modules/googleapis/build/src/index.js'
var fetchHistory = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google23.gmail({ version: 'v1', auth })
    try {
      const { startHistoryId } = req.query
      const response = yield gmail.users.history.list({
        userId: USER,
        historyTypes: ['labelAdded', 'labelRemoved', 'messageAdded'],
        startHistoryId,
      })
      if ((response == null ? void 0 : response.status) === 200) {
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

// src/controllers/Threads/deleteThread.ts
import { google as google24 } from './node_modules/googleapis/build/src/index.js'
var deleteSingleThread = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google24.gmail({ version: 'v1', auth })
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
var deleteThread = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(deleteSingleThread)(req, res)
  })

// src/controllers/Threads/thrashThread.ts
import { google as google25 } from './node_modules/googleapis/build/src/index.js'
var thrashSingleThread = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google25.gmail({ version: 'v1', auth })
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
var thrashThread = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(thrashSingleThread)(req, res)
  })

// src/controllers/Threads/updateThread.ts
import { google as google26 } from './node_modules/googleapis/build/src/index.js'
var updateSingleThread = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google26.gmail({ version: 'v1', auth })
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
var updateThread = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(updateSingleThread)(req, res)
  })

// src/controllers/Users/getSendAs.ts
import { google as google27 } from './node_modules/googleapis/build/src/index.js'
var fetchSendAs = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google27.gmail({ version: 'v1', auth })
    const { emailId } = req.query
    try {
      const response = yield gmail.users.settings.sendAs.get({
        userId: USER,
        sendAsEmail: emailId,
      })
      if ((response == null ? void 0 : response.status) === 200) {
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      throw Error(`Send as returned an error: ${err}`)
    }
  })
var getSendAs = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(fetchSendAs)(req, res)
  })

// src/controllers/Users/updateSendAs.ts
import { google as google28 } from './node_modules/googleapis/build/src/index.js'
var updateSendAsGmail = (auth, req) =>
  __async(void 0, null, function* () {
    const gmail = google28.gmail({ version: 'v1', auth })
    const { emailId, request } = req.body.params
    try {
      const response = yield gmail.users.settings.sendAs.update({
        userId: USER,
        sendAsEmail: emailId,
        requestBody: {
          signature: request.signature,
        },
      })
      if ((response == null ? void 0 : response.status) === 200) {
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      throw Error(`Send as returned an error: ${err}`)
    }
  })
var updateSendAs = (req, res) =>
  __async(void 0, null, function* () {
    authMiddleware(updateSendAsGmail)(req, res)
  })

// src/routes/index.ts
var router = express.Router()
router.get(
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',
  fetchAllContacts
)
router.get('/api/contact/search/:query?/:readMask?', queryContacts)
router.get(
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?',
  fetchFullThreads
)
router.get(
  '/api/threads/:labelIds?/:maxResults?/:nextPageToken?',
  fetchSimpleThreads
)
router.patch('/api/thread/:id?', updateThread)
router.post('/api/thread/thrash/:id?', thrashThread)
router.delete('/api/thread/', deleteThread)
router.get('/api/thread/:id?', fetchSingleThread)
router.post('/api/create-draft', createDraft)
router.get('/api/drafts/:maxResults?/:nextPageToken?', fetchDrafts)
router.get('/api/draft/:id?', fetchSingleDraft)
router.delete('/api/draft/', deleteDraft)
router.post('/api/send-draft', sendDraft)
router.put('/api/update-draft/?:id?', updateDraft)
router.patch('/api/message/:id?', updateMessage)
router.post('/api/message/thrash/:id?', thrashMessage)
router.delete('/api/message/', deleteMessage)
router.get('/api/message/attachment/:messageId?/:id?', fetchMessageAttachment)
router.post('/api/send-message', sendMessage)
router.post('/api/labels', createLabels)
router.get('/api/labels', fetchLabels)
router.get('/api/label/:id?', fetchSingleLabel)
router.patch('/api/labels', updateLabels)
router.delete('/api/labels', removeLabels)
router.get('/api/auth/oauth/google/', getAuthUrl)
router.post('/api/auth/oauth/google/callback/', getAuthenticateClient)
router.get('/api/user', getProfile)
router.get('/api/user/logout', logoutUser)
router.get('/api/history/:startHistoryId?', listHistory)
router.get('/api/health', health)
router.get('/api/settings/getSendAs', getSendAs)
router.put('/api/settings/updateSendAs', updateSendAs)
var routes_default = router

// src/routes/app.ts
import * as Sentry2 from './node_modules/@sentry/node/cjs/index.js'
import session from './node_modules/express-session/index.js'
import redis from './node_modules/connect-redis/index.js'

// src/data/redis.ts
import { createClient } from './node_modules/redis/dist/index.js'
var initiateRedis = () => {
  assertNonNullish(process.env.REDIS_PORT, 'No Redis Port defined')
  const redisClient2 =
    process.env.NODE_ENV === 'development'
      ? createClient({
          legacyMode: true,
        })
      : createClient({
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

// src/utils/initSentry.ts
import * as Sentry from './node_modules/@sentry/node/cjs/index.js'
import * as Tracing from './node_modules/@sentry/tracing/cjs/index.js'
function initSentry(app2) {
  assertNonNullish(process.env.SENTRY_DSN, 'No Sentry DSN provided')
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: app2 }),
      ],
      tracesSampleRate: 1,
    })
  }
}

// src/routes/app.ts
import compression from './node_modules/compression/index.js'
process.env.NODE_ENV !== 'production' &&
  console.log('Booted and ready for usage')
var app = express2()
var redisStore = redis(session)
var redisClient = redis_default()
app.use(compression())
app.set('trust proxy', 1)
assertNonNullish(process.env.SESSION_SECRET, 'No Session Secret.')
app.use(
  session({
    store: new redisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV !== 'production' ? false : true,
      httpOnly: true,
      maxAge: 1e3 * 60 * 10080,
      sameSite: process.env.NODE_ENV !== 'production' ? 'lax' : 'none',
    },
  })
)
app.use((req, res, next) => {
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )
  res.setHeader('credentials', 'include')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})
app.use(express2.json())
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
app.use('/', routes_default)
app.use(Sentry2.Handlers.requestHandler())
app.use(Sentry2.Handlers.tracingHandler())
app.use(Sentry2.Handlers.errorHandler())
app.use(function onError(err, req, res, next) {
  res.statusCode = 500
  res.end(res.sentry + '\n')
})
var app_default = app

// src/server.ts
var PORT = process.env.PORT || 5001
var server = http.createServer(app_default)
server.listen(PORT)
