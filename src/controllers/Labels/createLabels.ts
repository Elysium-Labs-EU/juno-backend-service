import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const newLabels = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { body } = req;

		const createNewLabel = () => {
			if (body) {
				const { labelListVisibility, messageListVisibility, name } = body;
				return new Promise((resolve, reject) => {
					gmail.users.labels.create(
						{
							userId: USER,
							requestBody: {
								labelListVisibility,
								messageListVisibility,
								name,
							},
						},
						(err, res) => {
							if (err) {
								reject(new Error(`Create labels returned an error: ${err}`));
							}
							if (res && res.data) {
								resolve(res.data);
							} else {
								reject(new Error('No labels created...'));
							}
						}
					);
				});
			}
			throw new Error('Invalid body');
		};
		if (body) {
			const labels = createNewLabel();
			if (labels) resolve(labels);
			reject(new Error('No labels created...'));
		}
	});
export const createLabels = (req, res) => {
	authenticated
		.then((auth) => {
			newLabels(auth, req).then((response) => {
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
