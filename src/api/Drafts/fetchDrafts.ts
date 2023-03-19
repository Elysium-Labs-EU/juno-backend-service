import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaListDraftsResponseSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

const getDrafts = async (auth: OAuth2Client | undefined) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.list({
      userId: USER,
    })
    if (response?.data) {
      gmailV1SchemaListDraftsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No drafts found...')
  } catch (err) {
    errorHandeling(err, 'fetchDrafts')
  }
}
export const fetchDrafts = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(getDrafts)(req)
  responseMiddleware(res, statusCode, data)
}
