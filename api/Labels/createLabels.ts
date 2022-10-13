import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const newLabels = async (auth: OAuth2Client | undefined, req: Request) => {
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
    return response
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`)
  }
}
export const createLabels = async (req: Request, res: Response) => {
  authMiddleware(newLabels)(req, res)
}
