import { Request, Response } from 'express'
import { GaxiosError } from 'googleapis-common'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const getLabel = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.labels.get({
      userId: USER,
      id,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No Label found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Label returned an error: ${err}`)
  }
}
export const fetchSingleLabel = async (req: Request, res: Response) => {
  authMiddleware(getLabel)(req, res)
}
