import { google } from 'googleapis';
import { authenticated } from '../../google/index';

const getContacts = (auth, req) =>
	new Promise((resolve, reject) => {
		const people = google.people({ version: 'v1', auth });
		const { query } = req;

		function listContacts() {
			const requestBody: any = {};

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

			return new Promise((resolve, reject) => {
				people.otherContacts.list(requestBody, (err, res) => {
					if (err) {
						reject(new Error(`Contacts returned an error: ${err}`));
					}
					if (res && res.data) {
						resolve(res.data);
					} else {
						reject(new Error('No contacts found...'));
					}
				});
			});
		}
		if (query) {
			const threads = listContacts();
			resolve(threads);
		}
		reject(new Error('No contacts found...'));
	});

export const fetchAllContacts = (req, res) => {
	authenticated
		.then((auth) => {
			getContacts(auth, req).then((response) => {
				res.status(200).json({
					message: response,
				});
			});
		})
		.catch((err) => {
			res.status(404).json(err);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
};
