import { google, people_v1 } from 'googleapis';
import { authenticated } from '../../google/index';

const getContacts = async (auth, req) => {
	const people = google.people({ version: 'v1', auth });

	async function listContacts() {
		const requestBody: people_v1.Params$Resource$Othercontacts$List = {};

		requestBody.pageSize =
			typeof Number(req.query.pageSize) !== 'number'
				? 1000
				: Number(req.query.pageSize);

		if (req.query.readMask) {
			requestBody.readMask = req.query.readMask;
		}
		if (req.query.pageToken) {
			requestBody.pageToken = req.query.pageToken;
		}

		try {
			const response = await people.otherContacts.list(requestBody);
			if (response && response.data) {
				return response.data;
			}
			return new Error('No contacts found...');
		} catch (err) {
			throw Error(`Contacts returned an error: ${err}`);
		}
	}
	try {
		const threads = await listContacts();
		if (threads) {
			return threads;
		}
		return new Error('No contacts found...');
	} catch (err) {
		throw Error(`Contacts returned an error: ${err}`);
	}
};

export const fetchAllContacts = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await getContacts(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(401).json(err);
	}
};
