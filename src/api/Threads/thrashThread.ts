import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, gmail_v1, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const thrashSingleThread = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  google.options({
    http2: false,
  })
  try {
    const response = await gmail.users.threads.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Single message return an error: ${err}`)
  }
}
export const thrashThread = async (req: Request, res: Response) => {
  authMiddleware(thrashSingleThread)(req, res)
}
