import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const deleteMessage = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { body } = req;

		function removeMessage() {
			if (body) {
				const { messageId } = body;
				return new Promise((resolve, reject) => {
					gmail.users.threads.delete(
						{
							userId: USER,
							id: messageId,
						},
						(err, res) => {
							if (err) {
								reject(err);
							}
							if (res && res.data) {
								resolve(res.data);
							} else {
								reject(new Error('Message not removed...'));
							}
						}
					);
				});
			}
			throw new Error('Invalid body');
		}
		const message = removeMessage();
		if (message) resolve(message);
		reject(new Error('Message not removed...'));
	});
export const deleteSingleMessage = (req, res) => {
	authenticated
		.then((auth) => {
			deleteMessage(auth, req).then((response) => {
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
