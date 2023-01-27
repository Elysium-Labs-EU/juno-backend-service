import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, gmail_v1, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { gmailV1SchemaLabelSchema } from '../../types/gmailTypes'

const refreshLabels = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id, requestBody },
  }: {
    body: {
      id: string
      requestBody: gmail_v1.Params$Resource$Users$Labels$Update
    }
  } = req

  try {
    const response = await gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody,
    })
    if (response?.data) {
      gmailV1SchemaLabelSchema.parse(response.data)
      return response.data
    }
    return new Error('No labels created...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw new Error(`Create labels returned an error: ${err}`)
  }
}
export const updateLabels = async (req: Request, res: Response) => {
  authMiddleware(refreshLabels)(req, res)
}
