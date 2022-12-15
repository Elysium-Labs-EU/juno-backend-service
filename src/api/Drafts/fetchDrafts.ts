import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const getDrafts = async (auth: OAuth2Client | undefined) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.list({
      userId: USER,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No drafts found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Drafts returned an error: ${err}`)
  }
}
export const fetchDrafts = async (req: Request, res: Response) => {
  authMiddleware(getDrafts)(req, res)
}
