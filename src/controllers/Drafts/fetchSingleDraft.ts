import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getDraft = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });

	async function singleDraft() {
		try {
			const response = await gmail.users.drafts.get({
				userId: USER,
				id: req.params.id,
				format: 'full',
			});
			if (response && response.data) {
				return response.data;
			}
			return new Error('Draft not found...');
		} catch (err) {
			throw Error(`Fetching Draft returned an error ${err}`);
		}
	}
	try {
		const draft = await singleDraft();
		if (draft) {
			return draft;
		}
		return new Error('Draft not found...');
	} catch (err) {
		throw Error(`Fetching Draft returned an error ${err}`);
	}
};
export const fetchSingleDraft = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await getDraft(auth, req);
		return res.status(200).json({ draft: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
