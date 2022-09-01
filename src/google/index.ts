import { OAuth2Client } from 'google-auth-library'
import assertNonNullish from '../utils/assertNonNullish'
import * as global from '../constants/globalConstants'

const SCOPES = [
  'openid',
  'profile',
  'https://mail.google.com',
  // 'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  // 'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
]

interface IAuthClient {
  access_token: string
  refresh_token: string
  scope: string
  token_type: 'Bearer'
  id_token: string
  expiry_date: number
}

interface IAuthorize {
  session: IAuthClient | null
  idToken?: string
}

const createAuthClientObject = () => {
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(
    process.env.GOOGLE_REDIRECT_URL,
    'No Google Redirect URL found'
  )

  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}${process.env.GOOGLE_REDIRECT_URL}`
  )
}

/**
 * @function authorize
 * @param {object} - takes in an object of the active Cookie session and requestAccessToken, the token is send by the user.
 * Compares the saved session's accessToken with the requestAccessToken. If it is a match, it uses the session to authorize the user.
 * @returns an OAuth2Client object if session exists, an error otherwise.
 */

export const authorize = async ({ session }: IAuthorize) => {
  if (session) {
    const oAuth2Client = createAuthClientObject()
    try {
      oAuth2Client.setCredentials(session)
      return oAuth2Client
    } catch (err) {
      return 'Error during authorization'
      console.log('err', JSON.stringify(err))
    }
  } else {
    return global.INVALID_TOKEN
  }
}

/**
 * @function authenticate
 * @param {object} - takes in an object of the active Cookie session and idToken, the token is send by the user
 * @returns a string 'INVALID Session' if the session doesn't exist, the response of the function 'Authorize' in case the function is called. Or console logs the error if there is a problem.
 */

export const authenticate = async ({ session, idToken }: IAuthorize) => {
  try {
    if (
      typeof session !== 'undefined' &&
      idToken &&
      (await checkIdValidity(idToken))
    ) {
      const response = await authorize({ session })
      return response
    }
    // If session is invalid, require the user to sign in again.
    return global.INVALID_SESSION
  } catch (err) {
    console.error(err)
  }
}

/**
 * @function getAuthenticateClient
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow. Return the partial client to the callback.
 */
export const getAuthenticateClient = async (req, res) => {
  try {
    const { code } = req.body
    // Now that we have the code, use that to acquire tokens.
    if (code) {
      const oAuth2Client = createAuthClientObject()
      const response = await oAuth2Client.getToken(code)
      // Make sure to set the credentials on the OAuth2 client.
      oAuth2Client.setCredentials(response.tokens)
      req.session.oAuthClient = oAuth2Client.credentials
      // Send back the id token to later use to verify the ID Token.
      const idToken = oAuth2Client.credentials.id_token
      //
      if (idToken) {
        return res.status(200).json({
          idToken: idToken.replace(/['"]+/g, ''),
        })
      } else {
        return res.status(400).json('Id Token not found')
      }
    }
  } catch (err) {
    process.env.NODE_ENV === 'development' && console.log('ERROR', err)
    res.status(401).json(err)
    throw Error(err)
  }
}

export const getAuthUrl = async (req, res) => {
  try {
    // create an oAuth client to authorize the API call.  Secrets are kept in the environment file,
    // which should be fetched from the Google Developers Console.
    const oAuth2Client = createAuthClientObject()

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      // prompt: 'consent',
      // include_granted_scopes: true,
    })

    return res.status(200).json(authorizeUrl)
  } catch (err) {
    res.status(401).json(err)
  }
}

/**
 * @function checkIdValidity
 * @param token received ID token from the API call
 * @returns true if the token is valid, false otherwise
 */
const checkIdValidity = async (token: string) => {
  const oAuth2Client = createAuthClientObject()
  try {
    await oAuth2Client.verifyIdToken({
      idToken: token.replace(/['"]+/g, ''),
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
