import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const refreshLabels = (auth, req) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });
		const { body } = req;

		function updateLabel(body) {
			if (body) {
				const { id, requestBody }: { id: string; requestBody: any } = body;
				return new Promise((resolve, reject) => {
					gmail.users.labels.patch(
						{
							userId: USER,
							id,
							requestBody,
						},
						(err, res) => {
							if (err) {
								reject(new Error(`Create labels returned an error: ${err}`));
							}
							const labels = res.data;
							if (labels !== null || undefined) {
								resolve(labels);
							} else {
								reject(new Error('No labels created...'));
							}
						}
					);
				});
			}
			throw new Error('Invalid body');
		}

		const labels = updateLabel(body);
		if (labels) resolve(labels);
		reject(new Error('No labels created...'));
	});
export const updateLabels = (req, res) => {
	authenticated
		.then((auth) => {
			refreshLabels(auth, req).then((response) => {
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
