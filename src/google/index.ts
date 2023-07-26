import { randomUUID } from 'crypto'
import { OAuth2Client } from 'google-auth-library'

import assertNonNullish from '../utils/assertNonNullish'
import createHashState from '../utils/createHashedState'

import type { Request, Response } from 'express'
import {
  credentialsSchema,
  getAuthUrlResponseSchema,
} from '../types/otherTypes'
import logger from '../middleware/loggerMiddleware'

const SCOPES = [
  'email',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
  'openid',
  'profile',
]

/**
 * @function createAuthClientObject
 * @param req can be either null or defined. Request is used on the route for local authorization. Null is used for a cloud based session.
 * @returns {OAuth2Client}
 */

export const createAuthClientObject = (req: Request | null): OAuth2Client => {
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
        req?.headers?.referer
      ) {
        return req.headers.referer.endsWith('/')
          ? req.headers.referer.slice(0, -1)
          : req.headers.referer
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
export const getAuthenticateClient = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body
    if (!code) {
      res.status(400).json('Code not found')
      throw new Error('Code not found')
    }
    // Now that we have the code, use that to acquire tokens.
    const oAuth2Client = createAuthClientObject(req)
    const { tokens } = await oAuth2Client.getToken(code)

    // Make sure to set the credentials on the OAuth2 client.
    if (state && state !== 'noSession') {
      try {
        if (
          req.session?.hashSecret &&
          createHashState(req.session.hashSecret) === state
        ) {
          if (
            tokens &&
            tokens?.id_token &&
            (await checkIdValidity(tokens.id_token))
          ) {
            oAuth2Client.setCredentials(tokens)
            req.session.oAuthClient = tokens
            // Logging the successful assignment of credentials
            logger.info(
              'Successfully set credentials on OAuth2Client and session'
            )
          } else {
            logger.warn('Invalid token during client authentication')
            return res.status(401).json(global.INVALID_TOKEN)
          }
        } else {
          logger.error('Invalid state detected during client authentication')
          res.status(401).json('Invalid state detected')
          throw new Error('Invalid state detected')
        }
      } catch (err) {
        logger.error(`Error during state and token check: ${err}`)
        throw err
      }
    }

    // Send back the authclient credentials to the user's browser whenever the noSession variable is found.
    if (state === 'noSession') {
      if (tokens) {
        oAuth2Client.setCredentials(tokens)
        const result = {
          credentials: oAuth2Client.credentials,
        }
        credentialsSchema.parse(result.credentials)
        return res.status(200).json({
          credentials: oAuth2Client.credentials,
        })
      } else {
        const errorMessage = 'Token not found'
        logger.error(errorMessage)
        return res.status(401).json(errorMessage)
      }
    }
    // If the session route is used, only send back a random id to the user.
    return res.status(200).json({
      idToken: `"${randomUUID()}"`,
    })
  } catch (err) {
    logger.error(`Error in getAuthenticateClient function: ${err}`)
    res.status(401).json(err.message)
  }
}

export const getAuthUrl = async (req: Request, res: Response) => {
  try {
    // Create an oAuth client to authorize the API call.  Secrets are kept in the environment file,
    // which should be fetched from the Google Developers Console.
    const oAuth2Client = createAuthClientObject(req)
    const randomID = randomUUID()

    // The hashState will be send to the user and the source secret will be stored in the session - to verify the incoming request later.
    const hashState = createHashState(randomID)
    req.session.hashSecret = randomID

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      // Use 'select_account' to ensure that the user is always using the wanted user.
      prompt: 'select_account',
      scope: SCOPES,
      // Use a SHA256 state for security reasons when the cloud version is used.
      state: req?.body?.noSession ? 'noSession' : hashState,
      // code_challenge_method: S256,
      // code_challenge: createHash('sha256').digest('hex'),
    })
    getAuthUrlResponseSchema.parse(authorizeUrl)
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
  const oAuth2Client = createAuthClientObject(null)
  try {
    await oAuth2Client.verifyIdToken({
      idToken: token.replace(/['"]+/g, ''),
    })
    return true
  } catch (err) {
    console.log('google err', err)
    return false
  }
}
