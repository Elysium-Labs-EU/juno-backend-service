import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const thrashMessage = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const messageId = req.params.id;

		function singleMessage(messageId) {
			return new Promise((resolve, reject) => {
				gmail.users.threads.trash(
					{
						userId: USER,
						id: messageId,
					},
					(err, res) => {
						if (err) {
							reject(err);
						}
						const message = res.data;
						if (message !== null) {
							resolve(message);
						} else {
							reject(new Error('Message not found...'));
						}
					}
				);
			});
		}

		const message = singleMessage(messageId);
		if (message) resolve(message);
		reject(new Error('Message not found...'));
	});
export const thrashSingleMessage = (req, res) => {
	authenticated
		.then((auth) => {
			thrashMessage(auth, req).then((response) => {
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
