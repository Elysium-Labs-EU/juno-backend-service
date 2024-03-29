import type { Request, Response } from 'express'

import { createAuthClientObject } from '../../google'

export const logoutUser = (req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      if (req.session.oAuthClient) {
        const oAuth2Client = createAuthClientObject(null)
        oAuth2Client.setCredentials(req.session.oAuthClient)
        void oAuth2Client.revokeCredentials()
      }
      req.session.destroy(function (err) {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('logout err', err)
          return res.status(401).json(err.message)
        }
        return res.status(205).json()
      })
    }
  } catch (err) {
    res.status(401).json(err.message)
  }
}
