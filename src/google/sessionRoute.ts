import { createAuthClientObject, checkIdValidity } from '.'
import * as global from '../constants/globalConstants'

interface IAuthClient {
  access_token: string
  refresh_token: string
  scope: string
  token_type: 'Bearer'
  id_token: string
  expiry_date: number
}

interface IAuthorizeSession {
  session: IAuthClient | null
  idToken?: string
}

/**
 * @function authorizeSession
 * @param {object} - takes in an object of the active Cookie session.
 * @returns an OAuth2Client object if session exists, an error otherwise.
 */

export const authorizeSession = async ({ session }: IAuthorizeSession) => {
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
 * @function authenticateSession
 * @param {object} - takes in an object of the active Cookie session and idToken, the token is send by the user
 * @returns a string 'INVALID Session' if the session doesn't exist, the response of the function 'Authorize' in case the function is called. Or console logs the error if there is a problem.
 */

export const authenticateSession = async ({
  session,
  idToken,
}: IAuthorizeSession) => {
  try {
    if (
      typeof session !== 'undefined' &&
      idToken &&
      (await checkIdValidity(idToken))
    ) {
      const response = await authorizeSession({ session })
      return response
    }
    // If session is invalid, require the user to sign in again.
    return global.INVALID_SESSION
  } catch (err) {
    console.error(err)
  }
}
