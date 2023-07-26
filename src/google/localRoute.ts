import type { Credentials } from 'google-auth-library'

import * as global from '../constants/globalConstants'
import logger from '../middleware/loggerMiddleware'

import { createAuthClientObject } from '.'

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
  if (!credentials) {
    logger.error('Credentials not provided')
    return global.INVALID_TOKEN
  }

  const oAuth2Client = createAuthClientObject(null)

  try {
    oAuth2Client.setCredentials(credentials)
    const checkedAccessToken = await oAuth2Client.getAccessToken()

    if (!checkedAccessToken) {
      logger.error('Cannot refresh the access token')
      return global.INVALID_TOKEN
    }

    return oAuth2Client
  } catch (err) {
    logger.error('Error during authorization', { error: err })
    return 'Error during authorization'
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
    if (!credentials) {
      logger.error('Credentials not provided')
      return global.INVALID_TOKEN
    }

    const response = await authorizeLocal({ credentials })
    return response
  } catch (err) {
    logger.error('Error during local authentication', { error: err })
  }
}
