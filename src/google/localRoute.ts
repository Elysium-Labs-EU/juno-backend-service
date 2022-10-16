import { createAuthClientObject, checkIdValidity } from '.'
import * as global from '../constants/globalConstants'
import { Credentials } from 'google-auth-library'

/**
 * @function authorizeLocal
 * @param {object} - takes in an object of the accessToken.
 * @returns an OAuth2Client object if accessToken is valid, an error otherwise.
 */

export const authorizeLocal = async ({
  credentials,
}: {
  credentials: Credentials
}) => {
  if (credentials) {
    const oAuth2Client = createAuthClientObject(null)
    try {
      oAuth2Client.setCredentials(credentials)
      const checkedAccessToken = await oAuth2Client.getAccessToken()
      if (!checkedAccessToken) {
        console.error('Cannot refresh the access token')
        return global.INVALID_TOKEN
      }
      if (
        oAuth2Client.credentials.id_token &&
        (await checkIdValidity(oAuth2Client.credentials.id_token))
      ) {
        return oAuth2Client
      } else {
        return global.INVALID_TOKEN
      }
    } catch (err) {
      return 'Error during authorization'
      console.log('err', JSON.stringify(err))
    }
  } else {
    return global.INVALID_TOKEN
  }
}

/**
 * @function authenticateLocal
 * @param {object} - takes in an object of the accessToken and idToken, the token is send by the user
 * @returns a string 'INVALID Session' if the session doesn't exist, the response of the function 'Authorize' in case the function is called. Or console logs the error if there is a problem.
 */

export const authenticateLocal = async ({
  credentials,
}: {
  credentials: Credentials
}) => {
  try {
    if (credentials) {
      const response = await authorizeLocal({ credentials })
      return response
    }
    // If a token is invalid, require the user to sign in again.
    return global.INVALID_TOKEN
  } catch (err) {
    console.error(err)
  }
}
