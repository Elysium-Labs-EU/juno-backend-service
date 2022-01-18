import { google } from 'googleapis';
import { authenticated } from '../../google/index';
import { USER } from '../../constants/globalConstants';

const exportDraft = async (auth, req) => {
	const gmail = google.gmail({ version: 'v1', auth });

	const { body, subject, to, sender, threadId, messageId, labelIds } = req.body;
	const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
	const messageParts = [
		`From: ${sender}`,
		`To: ${to}`,
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
	async function initiateDraft() {
		try {
			const response = await gmail.users.drafts.create({
				userId: USER,
				// id: draftId,
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
			return new Error('Draft is not created...');
		} catch (err) {
			throw Error(`Create Draft returned an error ${err}`);
		}
	}
	try {
		const finalMail = initiateDraft();
		if (finalMail) {
			return finalMail;
		}
		return new Error('Draft is not created...');
	} catch (err) {
		throw Error(`Create Draft returned an error ${err}`);
	}
};

export const createDraft = async (req, res) => {
	try {
		const auth = await authenticated();
		const response = await exportDraft(auth, req);
		return res.status(200).json({ message: response });
	} catch (err) {
		res.status(401).json(err);
	}
};
