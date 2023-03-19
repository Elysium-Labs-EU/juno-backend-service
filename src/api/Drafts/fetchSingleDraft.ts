import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaDraftSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
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
    errorHandeling(err, 'fetchSingleDraft')
  }
}
export const fetchSingleDraft = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(getDraft)(req)
  responseMiddleware(res, statusCode, data)
}
