import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaMessageSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

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
      gmailV1SchemaMessageSchema.parse(response)
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    errorHandeling(err, 'sendDraft')
  }
}
export const sendDraft = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(exportDraft)(req)
  responseMiddleware(res, statusCode, data)
}
