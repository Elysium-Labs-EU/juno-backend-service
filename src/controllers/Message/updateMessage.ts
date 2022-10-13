import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const modifyMessage = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.messages.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    throw Error(`Single message returned an error: ${err}`)
  }
}
export const updateMessage = async (req: Request, res: Response) => {
  authMiddleware(modifyMessage)(req, res)
}
