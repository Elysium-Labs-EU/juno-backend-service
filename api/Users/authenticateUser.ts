import { Request } from 'express'
import * as global from '../../constants/globalConstants'
import { authenticateLocal } from '../../google/localRoute'
import { authenticateSession } from '../../google/sessionRoute'

/**
 * @function authenticateUserSession
 * This route is used whenever the request authorization header is a string.
 * When running both the backend and frontend in the cloud or local, this route is useful.
 * @param req a request object that should hold the required idToken
 * @returns
 */

export const authenticateUserSession = async (req: Request) => {
  console.log('req ####', req)
  const response = await authenticateSession({
    req: req,
  })
  if (response === global.INVALID_TOKEN) {
    throw Error(response)
  }
  if (response === global.INVALID_SESSION) {
    throw Error(response)
  }
  if (response === 'Error during authorization') {
    throw Error(response)
  }
  return response
}

/**
 * @function authenticateUserLocal
 * This route is used whenever the request authorization header is an object and contains the accessToken key.
 * When running a local frontend and cloud backend, this route is useful.
 * @param req a request object that should hold the required accessToken and idToken
 * @returns
 */
export const authenticateUserLocal = async (req: Request) => {
  if (req.headers?.authorization) {
    const response = await authenticateLocal({
      credentials: JSON.parse(req.headers.authorization),
    })
    if (response === global.INVALID_TOKEN) {
      throw Error(response)
    }
    if (response === 'Error during authorization') {
      throw Error(response)
    }
    return response
  }
  throw Error('No Authorization header found')
}
