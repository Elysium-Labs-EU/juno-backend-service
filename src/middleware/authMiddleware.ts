import type { Request } from 'express'
import { OAuth2Client } from 'google-auth-library'

import {
  authenticateUserLocal,
  authenticateUserSession,
} from '../api/Users/authenticateUser'

export const authMiddleware =
  <T>(
    requestFunction: (
      auth: OAuth2Client | undefined,
      req: Request
    ) => Promise<T | Error>
  ) =>
  async (req: Request) => {
    try {
      if (req.headers?.authorization) {
        // A boolean to determine if the local or session authorization route should be used.
        const useLocalRoute =
          typeof JSON.parse(req.headers.authorization) === 'object'
        const auth = useLocalRoute
          ? await authenticateUserLocal(req)
          : await authenticateUserSession(req)
        const response = await requestFunction(auth, req)
        if (response instanceof Error) {
          return { success: false, data: response, statusCode: 400 }
        }
        return { success: true, data: response, statusCode: 200 }
        // return res.status(200).json({ status: 200, data: response });
      }
      return {
        success: false,
        data: 'There is no authorization header found',
        statusCode: 401,
      }
      // return res
      //   .status(401)
      //   .json({ status: 401, message: 'There is no authorization header found' });
    } catch (err) {
      process.env.NODE_ENV !== 'production' && console.error(err)
      return {
        statusCode: 401,
        success: false,
        error: err,
        data: err?.message || 'Internal server error',
      }
      // res.status(401).json({ status: 401, message: err?.message });
    }
  }
