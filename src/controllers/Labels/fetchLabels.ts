import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const getLabels = (auth) =>
	new Promise((resolve, reject) => {
		const gmail = google.gmail({ version: 'v1', auth });

		function listLabels() {
			return new Promise((resolve, reject) => {
				gmail.users.labels.list(
					{
						userId: USER,
					},
					(err, res) => {
						if (err) {
							reject(new Error(`Labels returned an error: ${err}`));
						}
						if (res && res.data) {
							resolve(res.data);
						} else {
							reject(new Error('No Labels found...'));
						}
					}
				);
			});
		}
		const labels = listLabels();
		if (labels) resolve(labels);
		reject(new Error('No Labels found...'));
	});
export const fetchLabels = (req, res) => {
	authenticated
		.then((auth) => {
			getLabels(auth).then((response) => {
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
