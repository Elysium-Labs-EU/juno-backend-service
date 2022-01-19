import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getDrafts = async (auth) => {
	const gmail = google.gmail({ version: 'v1', auth });

	try {
		const response = await gmail.users.drafts.list({
			userId: USER,
		});
		if (response && response.data) {
			return response.data;
		}
		return new Error('No drafts found...');
	} catch (err) {
		throw Error(`Drafts returned an error: ${err}`);
	}
};
export const fetchDrafts = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await getDrafts(auth);
		return res.status(200).json(response);
	} catch (err) {
		res.status(401).json(err);
	}
};
