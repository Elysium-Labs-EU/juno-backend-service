import { Request, Response } from 'express'

import { createAuthClientObject } from '../../google'

export const logoutUser = async (req: Request, res: Response) => {
  console.log("let's just not for now.")
  try {
    if (req.headers.authorization) {
      console.log('req.headers.authorization')
      if (req.session.oAuthClient) {
        const oAuth2Client = createAuthClientObject(null)
        oAuth2Client.setCredentials(req.session.oAuthClient)
        oAuth2Client.revokeCredentials()
        console.log('credentials have been REVOKED')
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
