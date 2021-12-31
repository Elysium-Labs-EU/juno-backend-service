const express = require('express');

const router = express.Router();

const { fetchThreads } = require('../controllers/Threads/fetchThreads');
const {
	fetchSingleThread,
} = require('../controllers/Threads/fetchSingleThread');
const { createDraft } = require('../controllers/Drafts/createDraft');
const { fetchDrafts } = require('../controllers/Drafts/fetchDrafts');
const { fetchSingleDraft } = require('../controllers/Drafts/fetchSingleDraft');
const { sendDraft } = require('../controllers/Drafts/sendDraft');
const { updateDraft } = require('../controllers/Drafts/updateDraft');
const { deleteDraft } = require('../controllers/Drafts/deleteDraft');
const {
	updateSingleMessage,
} = require('../controllers/Message/updateSingleMessage');
const {
	thrashSingleMessage,
} = require('../controllers/Message/thrashSingleMessage');
const {
	deleteSingleMessage,
} = require('../controllers/Message/deleteSingleMessage');
const {
	fetchMessageAttachment,
} = require('../controllers/Message/fetchMessageAttachment');
const { sendMessage } = require('../controllers/Message/sendMessage');
const { createLabels } = require('../controllers/Labels/createLabels');
const { fetchLabels } = require('../controllers/Labels/fetchLabels');
const { updateLabels } = require('../controllers/Labels/updateLabels');
const { removeLabels } = require('../controllers/Labels/removeLabels');
const { getProfile } = require('../controllers/Users/getProfile');
const {
	fetchAllContacts,
} = require('../controllers/Contacts/fetchAllContacts');
const { queryContacts } = require('../controllers/Contacts/queryContacts');

router.get(
	'/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?',
	fetchAllContacts
);
router.get('/api/contact/search/:query?/:readMask?', queryContacts);
router.get(
	'/api/threads/:labelIds?/:maxResults?/:nextPageToken?',
	fetchThreads
);
router.get('/api/thread/:id?', fetchSingleThread);
router.post('/api/create-draft', createDraft);
router.get('/api/drafts/:maxResults?/:nextPageToken?', fetchDrafts);
router.get('/api/draft/:id?', fetchSingleDraft);
router.delete('/api/draft/', deleteDraft);
router.post('/api/send-draft', sendDraft);
router.put('/api/update-draft/?:id?', updateDraft);
router.patch('/api/message/:id?', updateSingleMessage);
router.post('/api/message/thrash/:id?', thrashSingleMessage);
router.delete('/api/message/', deleteSingleMessage);
router.get('/api/message/attachment/:messageId?/:id?', fetchMessageAttachment);
router.post('/api/send-message', sendMessage);
router.post('/api/labels', createLabels);
router.get('/api/labels', fetchLabels);
router.patch('/api/labels', updateLabels);
router.delete('/api/labels', removeLabels);
router.get('/api/user', getProfile);

module.exports = router;
