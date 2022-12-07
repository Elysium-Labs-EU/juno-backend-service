import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import formFieldParser from '../../utils/formFieldParser'
import messageEncoding from '../../utils/messageEncoding'

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

      if (response?.status === 200) {
        return response
      } else {
        return new Error('Draft is not created...')
      }
    }
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Create Draft returned an error ${err}`)
  }
}

export const createDraft = async (req: Request, res: Response) => {
  authMiddleware(setupDraft)(req, res)
}
