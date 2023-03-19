import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaDraftSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
import formFieldParser from '../../utils/formFieldParser/formFieldParser'
import messageEncoding from '../../utils/messageEncoding/messageEncoding'

async function setupDraft(auth: OAuth2Client | undefined, req: Request) {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    if ('body' in req) {
      const parsedResult: any = await formFieldParser(req)
      const { threadId } = parsedResult

      const response = await gmail.users.drafts.create({
        userId: USER,
        requestBody: {
          message: {
            raw: messageEncoding(parsedResult),
            threadId: threadId[0],
          },
        },
      })

      if (response?.status === 200 && response?.data) {
        gmailV1SchemaDraftSchema.parse(response.data)
        return response.data
      } else {
        return new Error('Draft is not created...')
      }
    }
  } catch (err) {
    errorHandeling(err, 'createDraft')
  }
}

export const createDraft = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(setupDraft)(req)
  responseMiddleware(res, statusCode, data)
}
