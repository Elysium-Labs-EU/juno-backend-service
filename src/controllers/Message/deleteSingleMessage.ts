import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const deleteMessage = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const {
		body: { id },
	} = req;

	try {
		const response = await gmail.users.threads.delete({
			userId: USER,
			id,
		});
		return response;
	} catch (err) {
		throw Error('Message not removed...');
	}
};
export const deleteSingleMessage = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await deleteMessage(auth, req);
		return res.status(200).json(response);
	} catch (err) {
		res.status(401).json(err);
	}
};
