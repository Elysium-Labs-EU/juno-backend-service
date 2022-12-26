import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'

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
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error('Message not removed...')
  }
}
export const deleteThread = async (req: Request, res: Response) => {
  authMiddleware(deleteSingleThread)(req, res)
}
