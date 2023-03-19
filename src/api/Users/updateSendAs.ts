import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaSendAsSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const updateSendAsGmail = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { emailId, request } = req.body.params

  try {
    const response = await gmail.users.settings.sendAs.update({
      userId: USER,
      sendAsEmail: emailId,
      requestBody: {
        signature: request.signature,
      },
    })
    if (response?.data) {
      gmailV1SchemaSendAsSchema.parse(response.data)
      return response.data
    }
    return new Error('No data found...')
  } catch (err) {
    errorHandeling(err, 'updateSendAs')
  }
}
export const updateSendAs = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(updateSendAsGmail)(req)
  responseMiddleware(res, statusCode, data)
}
