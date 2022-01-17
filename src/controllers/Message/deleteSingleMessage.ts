import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const deleteMessage = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const {
		body: { id },
	} = req;

	async function removeMessage() {
		try {
			const response = await gmail.users.threads.delete({
				userId: USER,
				id,
			});
			// TODO: Verify this method.
			return response;
		} catch (err) {
			throw Error('Message not removed...');
		}
	}
	try {
		const message = await removeMessage();
		if (message) {
			return message;
		}
		return new Error('Message not removed...');
	} catch (err) {
		throw Error(`Message Removing returned an error: ${err}`);
	}
};
export const deleteSingleMessage = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await deleteMessage(auth, req);
		return res.status(200).json({ data: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
