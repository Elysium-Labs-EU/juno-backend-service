import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getDrafts = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { query } = req;

		function listDrafts() {
			// const {pageToken} = req.query
			// const maxResults = req.query.maxResults ?? 20

			return new Promise((resolve, reject) => {
				gmail.users.drafts.list(
					{
						userId: USER,
						// maxResults,
						// pageToken: pageToken || undefined,
					},
					(err, res) => {
						if (err) {
							reject(new Error(`Drafts returned an error: ${err}`));
						}
						if (res && res.data) {
							resolve(res.data);
						} else {
							reject(new Error('No drafts found...'));
						}
					}
				);
			});
		}
		if (query) {
			const drafts = listDrafts();
			resolve(drafts);
		}
		if (!query) {
			reject(new Error('No drafts found...'));
		}
	});
export const fetchDrafts = (req, res) => {
	authenticated
		.then((auth) => {
			getDrafts(auth, req).then((response) => {
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
