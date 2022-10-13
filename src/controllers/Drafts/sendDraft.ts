import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const exportDraft = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.body

  try {
    const response = await gmail.users.drafts.send({
      userId: USER,
      requestBody: {
        id,
      },
    })
    if (response) {
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    throw Error(`Sending Draft encountered an error ${err}`)
  }
}
export const sendDraft = async (req: Request, res: Response) => {
  authMiddleware(exportDraft)(req, res)
}
