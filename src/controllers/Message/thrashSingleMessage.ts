import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const thrashMessage = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });

	try {
		const response = await gmail.users.threads.trash({
			userId: USER,
			id: req.params.id,
		});
		if (response && response.data) {
			return response.data;
		}
		return new Error('No message found...');
	} catch (err) {
		throw Error(`Single message return an error: ${err}`);
	}
};
export const thrashSingleMessage = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await thrashMessage(auth, req);
		return res.status(200).json(response);
	} catch (err) {
		res.status(401).json(err);
	}
};
