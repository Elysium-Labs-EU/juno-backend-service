import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const updateMessage = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const messageId = req.params.id;
		const resourceObject = req.body;

		function singleMessage(messageId, resourceObject) {
			return new Promise((resolve, reject) => {
				gmail.users.threads.modify(
					{
						userId: USER,
						id: messageId,
						requestBody: resourceObject,
					},
					(err, res) => {
						if (err) {
							reject(err);
						}
						if (res && res.data) {
							resolve(res.data);
						} else {
							reject(new Error('Message not found...'));
						}
					}
				);
			});
		}
		const message = singleMessage(messageId, resourceObject);
		if (message) resolve(message);
		reject(new Error('Message not found...'));
	});
export const updateSingleMessage = (req, res) => {
	authenticated
		.then((auth) => {
			updateMessage(auth, req).then((response) => {
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
