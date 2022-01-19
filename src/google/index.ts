import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import path from 'path';
import credentials from './credentials.json';

// If modifying these scopes, delete token.json.
const SCOPES = [
	'https://mail.google.com',
	'https://www.googleapis.com/auth/gmail.addons.current.message.action',
	'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
	'https://www.googleapis.com/auth/gmail.modify',
	'https://www.googleapis.com/auth/gmail.readonly',
	'https://www.googleapis.com/auth/gmail.modify',
	'https://www.googleapis.com/auth/gmail.compose',
	'https://www.googleapis.com/auth/gmail.send',
	'https://www.googleapis.com/auth/contacts.other.readonly',
];

const TOKEN_PATH = path.join(__dirname, 'token.json');

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
export const getNewToken = (oAuth2Client) =>
	new Promise((resolve, reject) => {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) {
					reject(new Error(err));
				}
				oAuth2Client.setCredentials(token);
				// Save the token for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), () => {
					if (err) {
						reject(new Error(err));
					}
					console.log('Token stored to', TOKEN_PATH);
					return null;
				});
				resolve(oAuth2Client);
			});
		});
	});

export const getClientSecret = () => credentials;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = () => {
	const { client_secret, client_id, redirect_uris } = credentials.installed;

	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	);

	return new Promise((resolve, reject) => {
		// Check if we have previously stored a token.
		fs.readFile(TOKEN_PATH, (err: unknown, token: unknown) => {
			if (err) {
				getNewToken(oAuth2Client).then(
					(oAuth2ClientNew) => {
						resolve(oAuth2ClientNew);
					},
					() => {
						reject(new Error(err as string));
					}
				);
			} else {
				oAuth2Client.setCredentials(JSON.parse(token as string));
				resolve(oAuth2Client);
			}
		});
	});
};

export const authenticated = async () => {
	// Load client secrets from a local file.
	return await authorize();
};
