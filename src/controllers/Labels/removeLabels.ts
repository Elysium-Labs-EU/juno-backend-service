import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const removeTheLabels = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const {
		body: { id },
	} = req;

	async function deleteLabel() {
		try {
			const response = await gmail.users.labels.delete({
				userId: USER,
				id,
			});
			// TODO: Verify this method.
			return response;
		} catch (err) {
			throw Error(`Create labels returned an error: ${err}`);
		}
	}
	try {
		const labels = await deleteLabel();
		if (labels) {
			return labels;
		}
		return new Error('No labels created...');
	} catch (err) {
		throw Error(`Create labels returned an error: ${err}`);
	}
};

export const removeLabels = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await removeTheLabels(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
