import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getThreads = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { query } = req;

		function listThreads() {
			const requestBody: any = {
				userId: USER,
			};
			requestBody.maxResults =
				typeof Number(req.query.maxResults) !== 'number'
					? 20
					: Number(req.query.maxResults);
			if (req.query.labelIds && req.query.labelIds !== 'undefined') {
				requestBody.labelIds = req.query.labelIds;
			}
			if (req.query.pageToken) {
				requestBody.pageToken = req.query.pageToken;
			}
			if (req.query.q) {
				requestBody.q = req.query.q;
			}

			return new Promise((resolve, reject) => {
				gmail.users.threads.list(requestBody, (err, res) => {
					if (err) {
						reject(new Error(`Threads returned an error: ${err}`));
					}
					if (res && res.data) {
						resolve(res.data);
					} else {
						reject(new Error('No threads found...'));
					}
				});
			});
		}
		if (query) {
			const threads = listThreads();
			resolve(threads);
		}
		reject(new Error('No threads found...'));
	});

export const fetchFullThreads = (req, res) => {
	authenticated
		.then((auth) => {
			getThreads(auth, req).then((response) => {
				res.status(200).json(response);
			});
		})
		.catch((err) => {
			res.status(404).json(err);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
};
