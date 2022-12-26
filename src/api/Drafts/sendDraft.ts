import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'

const exportDraft = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id }: { id: string } = req.body

  try {
    const response = await gmail.users.drafts.send({
      userId: USER,
      requestBody: {
        id,
      },
    })
    if (response) {
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Sending Draft encountered an error ${err}`)
  }
}
export const sendDraft = async (req: Request, res: Response) => {
  authMiddleware(exportDraft)(req, res)
}
