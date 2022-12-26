import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'
import formFieldParser from '../../utils/formFieldParser.ts'
import messageEncoding from '../../utils/messageEncoding.ts'

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
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Draft update encountered an error ${err}`)
  }
}

export const updateDraft = async (req: Request, res: Response) => {
  authMiddleware(exportDraft)(req, res)
}
