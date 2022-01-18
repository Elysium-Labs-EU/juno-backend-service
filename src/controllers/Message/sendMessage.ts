import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const exportMessage = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });
	const { body, subject, to, cc, sender, id, threadId } = req.body;
	const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
	const messageParts = [
		`From: ${sender}`,
		`To: ${to}`,
		`Cc: ${cc}`,
		'Content-Type: text/html; charset=utf-8',
		'MIME-Version: 1.0',
		`Subject: ${utf8Subject}`,
		'',
		`${body}`,
	];
	const message = messageParts.join('\n');

	// The body needs to be base64url encoded.
	const encodedMessage = Buffer.from(message)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	async function sendMail() {
		try {
			const response = await gmail.users.messages.send({
				userId: USER,
				requestBody: {
					raw: encodedMessage,
					id,
					threadId,
				},
			});
			if (response) {
				return response;
			}
			return new Error('Mail was not sent...');
		} catch (err) {
			throw Error(`Mail was not sent...: ${err}`);
		}
	}
	try {
		const emailResult = await sendMail();
		if (emailResult) {
			return emailResult;
		}
		return new Error('Mail was not sent...');
	} catch (err) {
		throw Error(`Mail was not sent...: ${err}`);
	}
};
export const sendMessage = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await exportMessage(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(401).json(err);
	}
};
