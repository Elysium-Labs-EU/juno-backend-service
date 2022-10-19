import { Request, Response } from 'express'
import { GaxiosError } from 'googleapis-common'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { remapFullMessage } from '../../utils/threadFullRemap'

const getDraft = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.get({
      userId: USER,
      id: req.params.id,
      format: 'full',
    })
    if (response && response.data?.message) {
      const decodedResult = await remapFullMessage(response.data.message, gmail)
      return { id: response.data.id, message: decodedResult }
    }
    return new Error('Draft not found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Fetching Draft returned an error ${err}`)
  }
}
export const fetchSingleDraft = async (req: Request, res: Response) => {
  authMiddleware(getDraft)(req, res)
}
