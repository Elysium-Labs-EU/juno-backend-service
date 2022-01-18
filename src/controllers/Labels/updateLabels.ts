import { gmail_v1, google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const refreshLabels = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const {
		body: { id, requestBody },
	}: {
		body: {
			id: string;
			requestBody: gmail_v1.Params$Resource$Users$Labels$Update;
		};
	} = req;

	async function updateLabel() {
		try {
			const response = await gmail.users.labels.patch({
				userId: USER,
				id,
				requestBody,
			});
			if (response && response.data) {
				return response.data;
			}
			return new Error('No labels created...');
		} catch (err) {
			throw new Error(`Create labels returned an error: ${err}`);
		}
	}
	try {
		const labels = await updateLabel();
		if (labels) {
			return labels;
		}

		return new Error('No labels created...');
	} catch (err) {
		throw Error(`Create labels returned an error: ${err}`);
	}
};
export const updateLabels = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await refreshLabels(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
