import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'

const newLabels = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const {
      body: { labelListVisibility, messageListVisibility, name },
    } = req
    const response = gmail.users.labels.create({
      userId: USER,
      requestBody: {
        labelListVisibility,
        messageListVisibility,
        name,
      },
    })
    return response
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Create labels returned an error: ${err}`)
  }
}
export const createLabels = async (req: Request, res: Response) => {
  authMiddleware(newLabels)(req, res)
}
