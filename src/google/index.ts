import { OAuth2Client } from 'google-auth-library'
import assertNonNullish from '../utils/assertNonNullish'
import * as global from '../constants/globalConstants'

const SCOPES = [
  'openid',
  'profile',
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.other.readonly',
]

// const refreshSession = async ({ req, requestAccessToken }: any) => {
//
//   try {
//     const oAuth2Client = new OAuth2Client(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       `${process.env.FRONTEND_URL}${process.env.GOOGLE_REDIRECT_URL}`
//     )
//     oAuth2Client.setCredentials(requestAccessToken)
//
//     req.session.oAuthClient = oAuth2Client.credentials
//     return oAuth2Client
//   } catch (err) {
//     return getAuthUrl(req)
//     console.log('err', JSON.stringify(err))
//   }
// }
// const refreshSession = async () => {
//
//   const oAuth2Client: any = await getauthenticateClient()
//   if (oAuth2Client) {
//     // After acquiring an access_token, you may want to check on the audience, expiration,
//     // or original scopes requested.  You can do that with the `getTokenInfo` method.
//     const tokenInfo = await oAuth2Client.getTokenInfo(
//       oAuth2Client.credentials.access_token
//     )

//     if (tokenInfo.expiry_date > Math.floor(new Date().getTime())) {
//       return oAuth2Client
//     }
//     throw Error(`Expiration date before current date.`)
//   }
// }

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
  requestAccessToken: string | null
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

export const authorize = async ({
  session,
  requestAccessToken,
}: IAuthorize) => {
  if (
    requestAccessToken &&
    session?.access_token === requestAccessToken.replace(/['"]+/g, '')
  ) {
    const oAuth2Client = createAuthClientObject()
    try {
      oAuth2Client.setCredentials(session)
      return oAuth2Client
    } catch (err) {
      // return getNewRefreshToken(session.access_token)
      console.log('err', JSON.stringify(err))
    }
  } else {
    return global.INVALID_TOKEN
  }
}

export const authenticate = async ({
  session,
  requestAccessToken,
}: IAuthorize) => {
  try {
    if (typeof session !== 'undefined' && requestAccessToken) {
      const response = await authorize({ session, requestAccessToken })
      return response
    }
    // If session is invalid, require the user to sign in again.
    return global.INVALID_SESSION
  } catch (err) {
    console.error(err)
  }
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the partial client to the callback.
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
      return res.status(200).json({
        access_token: oAuth2Client.credentials.access_token,
        refresh_token: oAuth2Client.credentials.refresh_token,
      })
    }
  } catch (err) {
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
    })

    return res.status(200).json(authorizeUrl)
  } catch (err) {
    res.status(401).json(err)
  }
}
