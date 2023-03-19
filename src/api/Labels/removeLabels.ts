import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import errorHandeling from '../../utils/errorHandeling'

const deleteLabels = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.labels.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    errorHandeling(err, 'removeLabels')
  }
}

export const removeLabels = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(deleteLabels)(req)
  responseMiddleware(res, statusCode, data)
}
