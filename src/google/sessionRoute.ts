import { Credentials } from 'google-auth-library'
import { Request } from 'express'
import { createAuthClientObject, checkIdValidity } from '.'
import * as global from '../constants/globalConstants'

declare module 'express-session' {
  interface SessionData {
    oAuthClient: Credentials
  }
}

// interface IAuthClient {
//   access_token: string
//   refresh_token: string
//   scope: string
//   token_type: 'Bearer'
//   id_token: string
//   expiry_date: number
// }

// interface IAuthorizeSession {
//   // session: IAuthClient | null
//   req: Request
//   // idToken?: string
// }

/**
 * @function authorizeSession
 * @param {object} - takes in an object of the active Cookie session.
 * @returns an OAuth2Client object if session exists, an error otherwise.
 */

export const authorizeSession = async ({ req }: { req: Request }) => {
  const oAuth2Client = createAuthClientObject(null)
  try {
    if (req.session.oAuthClient) {
      // TODO: Check if the session is not existing on "cloud mode"
      // console.log('session', session)
      oAuth2Client.setCredentials(req.session.oAuthClient)
      // console.log(Date.now() + 10000)
      // const adjustedSession = {
      //   ...session,
      //   expiry_date: Date.now() + 1000,
      // }
      // console.log('adjustedSession', adjustedSession)
      // if (session?.refresh_token) {
      //   console.log('this session has a refresh token')
      // }
      // if (!session?.refresh_token) {
      //   console.log('this session has no refresh token')
      // }
      const accessToken = await oAuth2Client.refreshAccessToken()
      if (!accessToken?.res) {
        console.error('Cannot refresh the access token')
        return global.INVALID_TOKEN
      }
      if (
        accessToken.credentials.id_token &&
        (await checkIdValidity(accessToken.credentials.id_token))
      ) {
        req.session.oAuthClient = accessToken.credentials
        // Keep the session in sync with the latest version of the credentials
        return oAuth2Client
      }
    }
  } catch (err) {
    console.log('err', err)
    return 'Error during authorization'
  }
}

/**
 * @function authenticateSession
 * @param {object} - takes in an object of the active Cookie session and idToken, the token is send by the user
 * @returns a string 'INVALID Session' if the session doesn't exist, the response of the function 'Authorize' in case the function is called. Or console logs the error if there is a problem.
 */

export const authenticateSession = async ({ req }: { req: Request }) => {
  try {
    if (typeof req.session?.oAuthClient !== 'undefined') {
      const response = await authorizeSession({ req })
      return response
    }
    // If session is invalid, require the user to sign in again.
    return global.INVALID_SESSION
  } catch (err) {
    console.error('Error on authenticateSession', err)
  }
}
