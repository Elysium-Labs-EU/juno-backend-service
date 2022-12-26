import express from 'npm:express'

import { fetchAllContacts } from '../api/Contacts/fetchAllContacts.ts'
import { queryContacts } from '../api/Contacts/queryContacts.ts'
import { createDraft } from '../api/Drafts/createDraft.ts'
import { deleteDraft } from '../api/Drafts/deleteDraft.ts'
import { fetchDrafts } from '../api/Drafts/fetchDrafts.ts'
import { fetchSingleDraft } from '../api/Drafts/fetchSingleDraft.ts'
import { sendDraft } from '../api/Drafts/sendDraft.ts'
import { updateDraft } from '../api/Drafts/updateDraft.ts'
import { health } from '../api/health.ts'
import { listHistory } from '../api/History/listHistory.ts'
import { createLabels } from '../api/Labels/createLabels.ts'
import { fetchLabels } from '../api/Labels/fetchLabels.ts'
import { fetchSingleLabel } from '../api/Labels/fetchSingleLabel.ts'
import { removeLabels } from '../api/Labels/removeLabels.ts'
import { updateLabels } from '../api/Labels/updateLabels.ts'
import { deleteMessage } from '../api/Message/deleteMessage.ts'
import { fetchMessageAttachment } from '../api/Message/fetchMessageAttachment.ts'
import { sendMessage } from '../api/Message/sendMessage.ts'
import { thrashMessage } from '../api/Message/thrashMessage.ts'
import { updateMessage } from '../api/Message/updateMessage.ts'
import { deleteThread } from '../api/Threads/deleteThread.ts'
import { fetchFullThreads } from '../api/Threads/fetchFullThreads.ts'
import { fetchSimpleThreads } from '../api/Threads/fetchSimpleThreads.ts'
import { fetchSingleThread } from '../api/Threads/fetchSingleThread.ts'
import { thrashThread } from '../api/Threads/thrashThread.ts'
import { updateThread } from '../api/Threads/updateThread.ts'
import { getProfile } from '../api/Users/getProfile.ts'
import { getSendAs } from '../api/Users/getSendAs.ts'
import { logoutUser } from '../api/Users/logoutUser.ts'
import { updateSendAs } from '../api/Users/updateSendAs.ts'
import { getAuthenticateClient, getAuthUrl } from '../google/index.ts'

const router = express.Router()

router.delete('/api/draft/', deleteDraft)
router.delete('/api/labels', removeLabels)
router.delete('/api/message/', deleteMessage)
router.delete('/api/thread/', deleteThread)
router.get('/api/contact/search/:query?/:readMask?', queryContacts)
router.get(
  '/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',
  fetchAllContacts
)
router.get('/api/drafts/:maxResults?/:nextPageToken?', fetchDrafts)
router.get('/api/message/attachment/:messageId?/:id?', fetchMessageAttachment)
router.get(
  '/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?',
  fetchFullThreads
)
router.get(
  '/api/threads/:labelIds?/:maxResults?/:nextPageToken?',
  fetchSimpleThreads
)
router.get('/api/draft/:id?', fetchSingleDraft)
router.get('/api/health', health)
router.get('/api/label/:id?', fetchSingleLabel)
router.get('/api/labels', fetchLabels)
router.get('/api/settings/getSendAs', getSendAs)
router.get('/api/thread/:id?', fetchSingleThread)
router.get('/api/user', getProfile)
router.get('/api/user/logout', logoutUser)
router.patch('/api/labels', updateLabels)
router.patch('/api/message/:id?', updateMessage)
router.patch('/api/thread/:id?', updateThread)
router.post('/api/auth/oauth/google/', getAuthUrl)
router.post('/api/auth/oauth/google/callback/', getAuthenticateClient)
router.post('/api/create-draft', createDraft)
router.post('/api/history/:startHistoryId?', listHistory)
router.post('/api/labels', createLabels)
router.post('/api/message/thrash/:id?', thrashMessage)
router.post('/api/send-draft', sendDraft)
router.post('/api/send-message', sendMessage)
router.post('/api/thread/thrash/:id?', thrashThread)
router.put('/api/settings/updateSendAs', updateSendAs)
router.put('/api/update-draft/?:id?', updateDraft)

export default router
