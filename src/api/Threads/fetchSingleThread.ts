import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaThreadSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
import threadFullRemap from '../../utils/threadRemap/threadFullRemap'

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
      gmailV1SchemaThreadSchema.parse(response.data)
      const expandedResponse = await threadFullRemap(response.data, gmail)
      return expandedResponse
    }
    return new Error('Thread not found...')
  } catch (err) {
    errorHandeling(err, 'fetchSingleThread')
  }
}
export const fetchSingleThread = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(getThread)(req)
  responseMiddleware(res, statusCode, data)
}
