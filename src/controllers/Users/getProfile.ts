import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const fetchProfile = async (auth) => {
	const gmail = google.gmail({ version: 'v1', auth });

	async function listUser() {
		try {
			const response = await gmail.users.getProfile({
				userId: USER,
			});
			if (response && response.status === 200) {
				return response.data;
			}
			return new Error('No Profile found...');
		} catch (err) {
			throw Error(`Profile returned an error: ${err}`);
		}
	}
	try {
		const user = await listUser();
		if (user) {
			return user;
		}
		return new Error('No Profile found...');
	} catch (err) {
		throw Error(`Profile returned an error: ${err}`);
	}
};
export const getProfile = async (req, res) => {
	try {
		const auth = await authenticated;
		const response = await fetchProfile(auth);
		return res.status(200).json({ data: response });
	} catch (err) {
		res.status(404).json(err);
		res.status(401).json(err);
	}
};
