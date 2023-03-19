import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaLabelSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const fetchSingleLabel = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.labels.get({
      userId: USER,
      id,
    })
    if (response?.data) {
      gmailV1SchemaLabelSchema.parse(response.data)
      return response.data
    }
    return new Error('No Label found...')
  } catch (err) {
    errorHandeling(err, 'getSingleLabel')
  }
}
export const getSingleLabel = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(fetchSingleLabel)(req)
  responseMiddleware(res, statusCode, data)
}
