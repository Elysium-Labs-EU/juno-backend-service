import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'
import threadFullRemap from '../../utils/threadFullRemap.ts'

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
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Threads returned an error: ${err}`)
  }
}
export const fetchSingleThread = async (req: Request, res: Response) => {
  authMiddleware(getThread)(req, res)
}
