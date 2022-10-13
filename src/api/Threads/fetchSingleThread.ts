import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import threadFullRemap from '../../utils/threadFullRemap'

const getThread = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.threads.get({
      userId: USER,
      id,
      format: 'full',
    })
    if (response && response.data) {
      const expandedResponse = await threadFullRemap(response.data, gmail)
      return expandedResponse
    }
    return new Error('Thread not found...')
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}
export const fetchSingleThread = async (req: Request, res: Response) => {
  authMiddleware(getThread)(req, res)
}
