import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaLabelSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const refreshLabels = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id, requestBody },
  }: {
    body: {
      id: string
      requestBody: gmail_v1.Params$Resource$Users$Labels$Update
    }
  } = req

  try {
    const response = await gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody,
    })
    if (response?.data) {
      gmailV1SchemaLabelSchema.parse(response.data)
      return response.data
    }
    return new Error('No labels created...')
  } catch (err) {
    errorHandeling(err, 'updateLabels')
  }
}
export const updateLabels = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(refreshLabels)(req)
  responseMiddleware(res, statusCode, data)
}
