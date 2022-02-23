import { google } from 'googleapis'
// import credentials from './credentials.json'

// export const getClientSecret = () => credentials

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = async (token) => {
  // const { client_secret, client_id, redirect_uris } = credentials.installed

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
    // client_id,
    // client_secret,
    // redirect_uris[0]
  )

  try {
    oAuth2Client.setCredentials(JSON.parse(token as string))
    return oAuth2Client
  } catch (err) {
    console.log('err', JSON.stringify(err))
  }
}

export const authenticated = async (token: any) => {
  return await authorize(token)
}
