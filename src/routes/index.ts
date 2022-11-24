import express from 'express'

import { fetchAllContacts } from 'api/Contacts/fetchAllContacts'
import { queryContacts } from 'api/Contacts/queryContacts'
import { createDraft } from 'api/Drafts/createDraft'
import { deleteDraft } from 'api/Drafts/deleteDraft'
import { fetchDrafts } from 'api/Drafts/fetchDrafts'
import { fetchSingleDraft } from 'api/Drafts/fetchSingleDraft'
import { sendDraft } from 'api/Drafts/sendDraft'
import { updateDraft } from 'api/Drafts/updateDraft'
import { health } from 'api/health'
import { listHistory } from 'api/History/listHistory'
import { createLabels } from 'api/Labels/createLabels'
import { fetchLabels } from 'api/Labels/fetchLabels'
import { fetchSingleLabel } from 'api/Labels/fetchSingleLabel'
import { removeLabels } from 'api/Labels/removeLabels'
import { updateLabels } from 'api/Labels/updateLabels'
import { deleteMessage } from 'api/Message/deleteMessage'
import { fetchMessageAttachment } from 'api/Message/fetchMessageAttachment'
import { sendMessage } from 'api/Message/sendMessage'
import { thrashMessage } from 'api/Message/thrashMessage'
import { updateMessage } from 'api/Message/updateMessage'
import { deleteThread } from 'api/Threads/deleteThread'
import { fetchFullThreads } from 'api/Threads/fetchFullThreads'
import { fetchSimpleThreads } from 'api/Threads/fetchSimpleThreads'
import { fetchSingleThread } from 'api/Threads/fetchSingleThread'
import { thrashThread } from 'api/Threads/thrashThread'
import { updateThread } from 'api/Threads/updateThread'
import { getProfile } from 'api/Users/getProfile'
import { getSendAs } from 'api/Users/getSendAs'
import { logoutUser } from 'api/Users/logoutUser'
import { updateSendAs } from 'api/Users/updateSendAs'
import { getAuthenticateClient, getAuthUrl } from 'google/index'

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
