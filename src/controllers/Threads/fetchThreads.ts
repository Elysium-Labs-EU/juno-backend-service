import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getThreads = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });

	async function listThreads() {
		const requestBody: any = {
			userId: USER,
		};
		requestBody.maxResults =
			typeof Number(req.query.maxResults) !== 'number'
				? 20
				: Number(req.query.maxResults);
		if (req.query.labelIds && req.query.labelIds !== 'undefined') {
			requestBody.labelIds = req.query.labelIds;
		}
		if (req.query.pageToken) {
			requestBody.pageToken = req.query.pageToken;
		}
		if (req.query.q) {
			requestBody.q = req.query.q;
		}
		try {
			const response = await gmail.users.threads.list(requestBody);
			if (response && response.data) return response.data;
			new Error('No threads found...');
		} catch (err) {
			new Error(`Threads returned an error: ${err}`);
		}
	}
	try {
		const threads = await listThreads();
		if (threads) return threads;
		return new Error('No threads found...');
	} catch (err) {
		new Error(`Threads returned an error: ${err}`);
	}
};

export const fetchThreads = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await getThreads(auth, req);
		return res.status(200).json(response);
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
