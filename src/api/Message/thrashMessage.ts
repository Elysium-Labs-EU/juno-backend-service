import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaMessageSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const thrashSingleMessage = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.messages.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response?.data) {
      gmailV1SchemaMessageSchema.parse(response)
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    errorHandeling(err, 'thrashMessage')
  }
}
export const thrashMessage = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(thrashSingleMessage)(req)
  responseMiddleware(res, statusCode, data)
}
