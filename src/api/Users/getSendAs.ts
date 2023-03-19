import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaSendAsSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

export const fetchSendAs = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { emailId } = req.query

  if (typeof emailId === 'string') {
    try {
      const response = await gmail.users.settings.sendAs.get({
        userId: USER,
        sendAsEmail: emailId,
      })
      if (response?.data) {
        gmailV1SchemaSendAsSchema.parse(response.data)
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      errorHandeling(err, 'getSendAs')
    }
  } else {
    throw Error('Invalid email id request')
  }
}
export const getSendAs = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(fetchSendAs)(req)
  responseMiddleware(res, statusCode, data)
}
