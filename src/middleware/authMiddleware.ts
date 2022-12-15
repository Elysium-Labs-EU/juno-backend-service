import type { Request, Response } from 'express'
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
  async (req: Request, res: Response) => {
    try {
      if (req.headers?.authorization) {
        // A boolean to determine if the local or session authorization route should be used.
        const useLocalRoute =
          typeof JSON.parse(req.headers.authorization) === 'object'
        const auth = useLocalRoute
          ? await authenticateUserLocal(req)
          : await authenticateUserSession(req)
        const response = await requestFunction(auth, req)
        return res.status(200).json(response)
      }
      return res.status(401).json('There is no authorization header found')
    } catch (err) {
      process.env.NODE_ENV !== 'production' && console.error(err)
      res.status(401).json(err?.message)
    }
  }
