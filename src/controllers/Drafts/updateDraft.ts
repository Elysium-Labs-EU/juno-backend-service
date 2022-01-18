import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const exportDraft = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });

	const {
		body,
		subject,
		to,
		cc,
		bcc,
		sender,
		draftId,
		threadId,
		messageId,
		labelIds,
	} = req.body;
	const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
	const messageParts = [
		`From: ${sender}`,
		`To: ${to}`,
		`Cc: ${cc}`,
		`Bcc: ${bcc}`,
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
	async function initiateDraft(encodedMessage) {
		try {
			const response = await gmail.users.drafts.update({
				userId: USER,
				id: draftId,
				requestBody: {
					message: {
						raw: encodedMessage,
						id: messageId,
						threadId,
						labelIds,
					},
				},
			});
			if (response) {
				return response;
			}
			return new Error('Draft is not updated...');
		} catch (err) {
			throw Error(`Draft update encountered an error ${err}`);
		}
	}
	try {
		const finalMail = await initiateDraft(encodedMessage);
		return finalMail;
	} catch (err) {
		throw Error('Draft is not updated...');
	}
};

export const updateDraft = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await exportDraft(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(401).json(err);
	}
};
