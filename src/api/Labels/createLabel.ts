import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaLabelSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

export const newLabel = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const {
      body: { labelListVisibility, messageListVisibility, name },
    } = req
    const response = gmail.users.labels.create({
      userId: USER,
      requestBody: {
        labelListVisibility,
        messageListVisibility,
        name,
      },
    })
    const validatedResponse = gmailV1SchemaLabelSchema.parse(response)
    return validatedResponse
  } catch (err) {
    errorHandeling(err, 'createLabel')
  }
}
export const createLabel = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(newLabel)(req)
  responseMiddleware(res, statusCode, data)
}
