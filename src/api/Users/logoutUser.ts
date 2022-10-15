import { Request, Response } from 'express'

import { createAuthClientObject } from '../../google'

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      if (req.session.oAuthClient) {
        const oAuth2Client = createAuthClientObject(null)
        oAuth2Client.setCredentials(req.session.oAuthClient)
        oAuth2Client.revokeCredentials()
      }
      req.session.destroy(function (err) {
        if (err) {
          console.log(err)
          return res.status(401).json(err.message)
        }
        return res.status(205).json()
      })
    }
  } catch (err) {
    res.status(401).json(err.message)
  }
}
