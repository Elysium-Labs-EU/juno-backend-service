import type { Request } from 'express'
import type { Credentials } from 'google-auth-library'

import * as global from '../constants/globalConstants'
import logger from '../middleware/loggerMiddleware'

import { createAuthClientObject } from '.'

declare module 'express-session' {
  interface SessionData {
    hashSecret: string
    isNew: boolean
    oAuthClient: Credentials
  }
}

/**
 * @function authorizeSession
 * @param {object} - takes in an object of the active Cookie session.
 * @returns an OAuth2Client object if session exists, an error otherwise.
 */

export const authorizeSession = async ({ req }: { req: Request }) => {
  const oAuth2Client = createAuthClientObject(null)
  try {
    if (req.session.oAuthClient) {
      oAuth2Client.setCredentials(req.session.oAuthClient)
      const checkedAccessToken = await oAuth2Client.getAccessToken()
      if (!checkedAccessToken) {
        void logger?.error('Cannot refresh the access token')
        // eslint-disable-next-line no-console
        console.error('Cannot refresh the access token')
        return global.INVALID_TOKEN
      }
      // Keep the session in sync with the latest version of the credentials
      req.session.oAuthClient = oAuth2Client.credentials
      return oAuth2Client
    }
  } catch (err) {
    void logger?.error(`Error during authorization: ${err}`)
    // eslint-disable-next-line no-console
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
      if (response === global.INVALID_TOKEN) {
        // Log when a session token is found to be invalid
        void logger?.warn(
          'Session token found to be invalid during authentication'
        )
      }
      return response
    } else {
      // Log when a session is found to be invalid
      void logger?.warn('Invalid session found during authentication')
    }

    return global.INVALID_SESSION
  } catch (err) {
    void logger?.error(`Error on authenticateSession: ${err}`)
  }
}
