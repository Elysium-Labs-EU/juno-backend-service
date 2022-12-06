import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import formFieldParser from '../../utils/formFieldParser'
import messageEncoding from '../../utils/messageEncoding'

const exportMessage = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id, threadId } = req.body

  try {
    if ('body' in req) {
      const parsedResult: any = await formFieldParser(req)
      const response = await gmail.users.messages.send({
        userId: USER,
        requestBody: {
          raw: messageEncoding(parsedResult),
          id,
          threadId,
        },
      })
      if (response) {
        return response
      }
      return new Error('Mail was not sent...')
    }
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Mail was not sent...: ${err}`)
  }
}
export const sendMessage = async (req: Request, res: Response) => {
  authMiddleware(exportMessage)(req, res)
}
