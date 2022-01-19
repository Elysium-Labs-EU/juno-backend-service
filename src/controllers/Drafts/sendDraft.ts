import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const exportDraft = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const { id } = req.body;

	try {
		const response = await gmail.users.drafts.send({
			userId: USER,
			requestBody: {
				id,
			},
		});
		if (response) {
			return response;
		}
		return new Error('Mail was not sent...');
	} catch (err) {
		throw Error(`Sending Draft encountered an error ${err}`);
	}
};
export const sendDraft = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await exportDraft(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(401).json(err);
	}
};
