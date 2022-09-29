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

export const authorizeSession = async ({
  session,
  idToken,
}: IAuthorizeSession) => {
  if (session) {
    const oAuth2Client = createAuthClientObject()
    try {
      // TODO: Check this part of the flow - it crashes here. The refresh token should be saved somewhere else, since the session is terminated on logout. Thus losogin the access to the refreshToken
      if (session?.refresh_token) {
        console.log('this session has a refresh token')
        oAuth2Client.setCredentials({ refresh_token: session?.refresh_token })
      }
      if (!session?.refresh_token) {
        console.log('this session has no refresh token')
      }
      const accessToken = await oAuth2Client.getAccessToken()
      // oAuth2Client.setCredentials(session)
      if (accessToken?.res) {
        console.log('accessToken.res', accessToken.res)
        oAuth2Client.setCredentials(accessToken.res.data)
      } else {
        try {
          const refreshedToken = await oAuth2Client.refreshAccessToken()
          oAuth2Client.setCredentials(refreshedToken?.res?.data)
        } catch (err) {
          console.error('Cannot refresh the access token')
        }
      }
      if (idToken && (await checkIdValidity(idToken))) {
        return oAuth2Client
      }
    } catch (err) {
      console.log('err', JSON.stringify(err))
      return 'Error during authorization'
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
    if (typeof session !== 'undefined') {
      const response = await authorizeSession({ session, idToken })
      return response
    }
    // If session is invalid, require the user to sign in again.
    return global.INVALID_SESSION
  } catch (err) {
    console.error('Error on authenticateSession', err)
  }
}
