import express from 'express'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'

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

router.get(
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',
  verifySession(),
  fetchAllContacts
)
router.get(
  '/api/contact/search/:query?/:readMask?',
  verifySession(),
  queryContacts
)
router.get(
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?',
  verifySession(),
  fetchFullThreads
)
router.get(
  '/api/threads/:labelIds?/:maxResults?/:nextPageToken?',
  verifySession(),
  fetchThreads
)
router.get('/api/thread/:id?', verifySession(), fetchSingleThread)
router.post('/api/create-draft', verifySession(), createDraft)
router.get(
  '/api/drafts/:maxResults?/:nextPageToken?',
  verifySession(),
  fetchDrafts
)
router.get('/api/draft/:id?', verifySession(), fetchSingleDraft)
router.delete('/api/draft/', verifySession(), deleteDraft)
router.post('/api/send-draft', verifySession(), sendDraft)
router.put('/api/update-draft/?:id?', verifySession(), updateDraft)
router.patch('/api/message/:id?', verifySession(), updateSingleMessage)
router.post('/api/message/thrash/:id?', verifySession(), thrashSingleMessage)
router.delete('/api/message/', verifySession(), deleteSingleMessage)
router.get(
  '/api/message/attachment/:messageId?/:id?',
  verifySession(),
  fetchMessageAttachment
)
router.post('/api/send-message', verifySession(), sendMessage)
router.post('/api/labels', verifySession(), createLabels)
router.get('/api/labels', verifySession(), fetchLabels)
router.get('/api/label/:id?', verifySession(), fetchSingleLabel)
router.patch('/api/labels', verifySession(), updateLabels)
router.delete('/api/labels', verifySession(), removeLabels)
router.get('/api/user', verifySession(), getProfile)
router.get('/api/history/:startHistoryId?', verifySession(), listHistory)

export default router
