import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaMessageSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

// TODO: Double check if this route is being used on the frontend

const modifyMessage = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.messages.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response?.data) {
      gmailV1SchemaMessageSchema.parse(response)
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    errorHandeling(err, 'updateMessage')
  }
}
export const updateMessage = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(modifyMessage)(req)
  responseMiddleware(res, statusCode, data)
}
