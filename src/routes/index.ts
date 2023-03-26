import express from 'express'

import { getBase } from '../api/Base/getBase'
import { fetchAllContacts } from '../api/Contacts/fetchAllContacts'
import { queryContacts } from '../api/Contacts/queryContacts'
import { createDraft } from '../api/Drafts/createDraft'
import { deleteDraft } from '../api/Drafts/deleteDraft'
import { fetchDrafts } from '../api/Drafts/fetchDrafts'
import { fetchSingleDraft } from '../api/Drafts/fetchSingleDraft'
import { sendDraft } from '../api/Drafts/sendDraft'
import { updateDraft } from '../api/Drafts/updateDraft'
import { health } from '../api/health'
import { listHistory } from '../api/History/listHistory'
import { createLabel } from '../api/Labels/createLabel'
import { getLabels } from '../api/Labels/getLabels'
import { getSingleLabel } from '../api/Labels/getSingleLabel'
import { removeLabel } from '../api/Labels/removeLabel'
import { updateLabel } from '../api/Labels/updateLabel'
import { deleteMessage } from '../api/Message/deleteMessage'
import { fetchMessageAttachment } from '../api/Message/fetchMessageAttachment'
import { sendMessage } from '../api/Message/sendMessage'
import { thrashMessage } from '../api/Message/thrashMessage'
import { updateMessage } from '../api/Message/updateMessage'
import { deleteThread } from '../api/Threads/deleteThread'
import { fetchFullThreads } from '../api/Threads/fetchFullThreads'
import { fetchSimpleThreads } from '../api/Threads/fetchSimpleThreads'
import { fetchSingleThread } from '../api/Threads/fetchSingleThread'
import { thrashThread } from '../api/Threads/thrashThread'
import { updateThread } from '../api/Threads/updateThread'
import { getProfile } from '../api/Users/getProfile'
import { logoutUser } from '../api/Users/logoutUser'
import { updateSendAs } from '../api/Users/updateSendAs'
import { getAuthenticateClient, getAuthUrl } from '../google/index'

const router = express.Router()

const authEndpoints = {
  '/api/auth/oauth/google/': {
    post: getAuthUrl,
  },
  '/api/auth/oauth/google/callback/': {
    post: getAuthenticateClient,
  },
}

const baseEndpoints = {
  '/api/base': {
    post: getBase,
  },
}

const contactEndpoints = {
  '/api/contact/search/:query?/:readMask?': {
    get: queryContacts,
  },
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?': {
    get: fetchAllContacts,
  },
}

const draftEndpoints = {
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

const healthEndpoints = {
  '/api/health': {
    get: health,
  },
}

const historyEndpoints = {
  '/api/history/:startHistoryId?': {
    post: listHistory,
  },
}

const labelEndpoints = {
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

const messageEndpoints = {
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

const threadEndpoints = {
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

const userEndpoints = {
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

const combinedRoutes = {
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

export default router
