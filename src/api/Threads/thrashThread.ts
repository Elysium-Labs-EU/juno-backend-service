import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaThreadSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const thrashSingleThread = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  google.options({
    http2: false,
  })
  try {
    const response = await gmail.users.threads.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response?.data) {
      gmailV1SchemaThreadSchema.parse(response.data)
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    errorHandeling(err, 'thrashThread')
  }
}
export const thrashThread = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(thrashSingleThread)(req)
  responseMiddleware(res, statusCode, data)
}
