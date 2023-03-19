import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import errorHandeling from '../../utils/errorHandeling'

// TODO: Double check if this route is being used on the frontend

const deleteSingleMessage = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.messages.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'deleteMessage')
  }
}
export const deleteMessage = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(deleteSingleMessage)(req)
  responseMiddleware(res, statusCode, data)
}
