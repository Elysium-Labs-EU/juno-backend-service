import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getDraft = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const draftId = req.params.id;
		function singleDraft() {
			return new Promise((resolve, reject) => {
				gmail.users.drafts.get(
					{
						userId: USER,
						id: draftId,
						format: 'full',
					},
					(err, res) => {
						if (err) {
							reject(err);
						}
						if (res && res.data) {
							resolve(res.data);
						} else {
							reject(new Error('Draft not found...'));
						}
					}
				);
			});
		}

		const draft = singleDraft();
		if (draft) resolve(draft);
		reject(new Error('Draft not found...'));
	});
export const fetchSingleDraft = (req, res) => {
	authenticated
		.then((auth) => {
			getDraft(auth, req).then((response) => {
				res.status(200).json({
					draft: response,
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
