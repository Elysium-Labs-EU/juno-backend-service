import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getThread = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const threadId = req.params.id;

	async function singleThread() {
		try {
			const response = await gmail.users.threads.get({
				userId: USER,
				id: threadId,
				format: 'full',
			});
			if (response && response.data) {
				return response.data;
			}
			return new Error('Thread not found...');
		} catch (err) {
			throw Error(`Threads returned an error: ${err}`);
		}
	}
	try {
		const thread = await singleThread();
		if (thread) {
			return thread;
		}
		return new Error('Thread not found...');
	} catch (err) {
		throw Error(`Threads returned an error: ${err}`);
	}
};
export const fetchSingleThread = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await getThread(auth, req);
		return res.status(200).json({ thread: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
