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

const exportDraft = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    if ('body' in req) {
      const parsedResult: any = await formFieldParser(req)
      const { draftId, threadId, messageId } = parsedResult

      const response = await gmail.users.drafts.update({
        userId: USER,
        id: draftId,
        requestBody: {
          message: {
            raw: messageEncoding(parsedResult),
            id: messageId[0],
            threadId: threadId[0],
          },
        },
      })
      if (response?.status === 200 && response?.data) {
        gmailV1SchemaDraftSchema.parse(response.data)
        return response
      } else {
        return new Error('Draft is not updated...')
      }
    }
  } catch (err) {
    errorHandeling(err, 'updateDraft')
  }
}

export const updateDraft = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(exportDraft)(req)
  responseMiddleware(res, statusCode, data)
}
