import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, gmail_v1, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'

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
