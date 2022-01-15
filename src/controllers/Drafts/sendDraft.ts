import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const exportDraft = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { id } = req.body;

		function sendDraft() {
			return new Promise((resolve, reject) => {
				gmail.users.drafts.send(
					{
						userId: USER,
						requestBody: {
							id,
						},
					},
					(err, res) => {
						if (err) {
							reject(err);
						}
						if (res) {
							resolve(res);
						} else {
							reject(new Error('Mail was not send...'));
						}
					}
				);
			});
		}
		const finalMail = sendDraft();
		if (finalMail) resolve(finalMail);
		reject(new Error('Mail was not send...'));
	});
export const sendDraft = (req, res) => {
	authenticated
		.then((auth) => {
			exportDraft(auth, req).then((response) => {
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
