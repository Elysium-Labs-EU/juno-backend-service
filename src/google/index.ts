import { OAuth2Client } from 'google-auth-library'
import assertNonNullish from '../utils/assertNonNullish'

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

export const createAuthClientObject = (req?: any) => {
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(
    process.env.GOOGLE_REDIRECT_URL,
    'No Google Redirect URL found'
  )

  function determineAuthURLStructure() {
    if (process.env.NODE_ENV === 'production') {
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req
      ) {
        return req?.headers?.referer.endsWith('/')
          ? req.headers?.referer.slice(0, -1)
          : req.headers?.referer
      }
      return process.env.FRONTEND_URL
    }
    return process.env.FRONTEND_URL
  }

  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${determineAuthURLStructure()}${process.env.GOOGLE_REDIRECT_URL}`
  )
}

/**
 * @function getAuthenticateClient
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow. Return the partial client to the callback.
 * And store the oAuthClient to the user express session.
 */
export const getAuthenticateClient = async (req, res) => {
  try {
    const { code, state } = req.body
    // Now that we have the code, use that to acquire tokens.
    if (code) {
      const oAuth2Client = createAuthClientObject(req)
      const response = await oAuth2Client.getToken(code)
      // Make sure to set the credentials on the OAuth2 client.
      oAuth2Client.setCredentials(response.tokens)
      if (state !== 'noSession') {
        req.session.oAuthClient = oAuth2Client.credentials
      }
      // Send back the id token to later use to verify the ID Token.
      const idToken = oAuth2Client.credentials.id_token
      //
      if (idToken) {
        // Send back the authclient credentials to the user's browser whenever the noSession variable is found.
        if (state === 'noSession') {
          return res.status(200).json({
            credentials: oAuth2Client.credentials,
          })
        }
        // If the session route is used, only send back the id Token to frontend, and use the session to authorize.
        return res.status(200).json({
          idToken: idToken.replace(/['"]+/g, ''),
        })
      } else {
        return res.status(400).json('Id Token not found')
      }
    } else {
      res.status(400).json('Code not found')
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
      state: req?.body?.noSession ? 'noSession' : undefined,
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
export const checkIdValidity = async (token: string) => {
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
