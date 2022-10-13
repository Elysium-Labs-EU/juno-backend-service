import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const deleteSingleThread = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.threads.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error('Message not removed...')
  }
}
export const deleteThread = async (req: Request, res: Response) => {
  authMiddleware(deleteSingleThread)(req, res)
}
