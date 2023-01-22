import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { gmailV1SchemaDraftSchema } from '../../types/gmailTypes'
import { remapFullMessage } from '../../utils/threadRemap/threadFullRemap'

const getDraft = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.get({
      userId: USER,
      id: req.params.id,
      format: 'full',
    })
    if (response?.data?.message) {
      gmailV1SchemaDraftSchema.parse(response.data)
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
