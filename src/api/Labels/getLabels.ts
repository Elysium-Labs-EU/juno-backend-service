import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaListLabelsResponseSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

export const fetchLabels = async (auth: OAuth2Client | undefined) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.labels.list({
      userId: USER,
    })
    if (response?.data) {
      gmailV1SchemaListLabelsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No Labels found...')
  } catch (err) {
    errorHandeling(err, 'getLabels')
  }
}
export const getLabels = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(fetchLabels)(req)
  responseMiddleware(res, statusCode, data)
}
