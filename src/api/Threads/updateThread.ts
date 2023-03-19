import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaThreadSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const updateSingleThread = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.threads.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response?.data) {
      gmailV1SchemaThreadSchema.parse(response.data)
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    errorHandeling(err, 'updateThread')
  }
}
export const updateThread = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(updateSingleThread)(req)
  responseMiddleware(res, statusCode, data)
}
