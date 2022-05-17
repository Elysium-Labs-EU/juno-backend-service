import express from 'express'

const router = express.Router()

import { fetchThreads } from '../controllers/Threads/fetchThreads'
import { fetchFullThreads } from '../controllers/Threads/fetchFullThreads'
import { fetchSingleThread } from '../controllers/Threads/fetchSingleThread'
import { createDraft } from '../controllers/Drafts/createDraft'
import { fetchDrafts } from '../controllers/Drafts/fetchDrafts'
import { fetchSingleDraft } from '../controllers/Drafts/fetchSingleDraft'
import { sendDraft } from '../controllers/Drafts/sendDraft'
import { updateDraft } from '../controllers/Drafts/updateDraft'
import { deleteDraft } from '../controllers/Drafts/deleteDraft'
import { updateSingleMessage } from '../controllers/Message/updateSingleMessage'
import { thrashSingleMessage } from '../controllers/Message/thrashSingleMessage'
import { deleteSingleMessage } from '../controllers/Message/deleteSingleMessage'
import { fetchMessageAttachment } from '../controllers/Message/fetchMessageAttachment'
import { sendMessage } from '../controllers/Message/sendMessage'
import { createLabels } from '../controllers/Labels/createLabels'
import { fetchLabels } from '../controllers/Labels/fetchLabels'
import { fetchSingleLabel } from '../controllers/Labels/fetchSingleLabel'
import { updateLabels } from '../controllers/Labels/updateLabels'
import { removeLabels } from '../controllers/Labels/removeLabels'
import { getProfile } from '../controllers/Users/getProfile'
import { fetchAllContacts } from '../controllers/Contacts/fetchAllContacts'
import { queryContacts } from '../controllers/Contacts/queryContacts'
import { listHistory } from '../controllers/History/listHistory'
import { getAuthenticateClient, getAuthUrl } from '../google/index'
import { logoutUser } from '../controllers/Users/logoutUser'
import { health } from '../controllers/health'

router.get(
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',

  fetchAllContacts
)
router.get(
  '/api/contact/search/:query?/:readMask?',

  queryContacts
)
router.get(
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?',

  fetchFullThreads
)
router.get(
  '/api/threads/:labelIds?/:maxResults?/:nextPageToken?',

  fetchThreads
)
router.get('/api/thread/:id?', fetchSingleThread)
router.post('/api/create-draft', createDraft)
router.get(
  '/api/drafts/:maxResults?/:nextPageToken?',

  fetchDrafts
)
router.get('/api/draft/:id?', fetchSingleDraft)
router.delete('/api/draft/', deleteDraft)
router.post('/api/send-draft', sendDraft)
router.put('/api/update-draft/?:id?', updateDraft)
router.patch('/api/message/:id?', updateSingleMessage)
router.post('/api/message/thrash/:id?', thrashSingleMessage)
router.delete('/api/message/', deleteSingleMessage)
router.get(
  '/api/message/attachment/:messageId?/:id?',

  fetchMessageAttachment
)
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

export default router
