import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import formFieldParser from '../../utils/formFieldParser'
import messageEncoding from '../../utils/messageEncoding'

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
      if (response?.status === 200) {
        return response
      } else {
        return new Error('Draft is not updated...')
      }
    }
  } catch (err) {
    throw Error(`Draft update encountered an error ${err}`)
  }
}

export const updateDraft = async (req: Request, res: Response) => {
  authMiddleware(exportDraft)(req, res)
}