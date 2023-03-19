import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaMessageSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
import formFieldParser from '../../utils/formFieldParser/formFieldParser'
import messageEncoding from '../../utils/messageEncoding/messageEncoding'

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
        gmailV1SchemaMessageSchema.parse(response)
        return response
      }
      return new Error('Mail was not sent...')
    }
  } catch (err) {
    errorHandeling(err, 'sendMessage')
  }
}
export const sendMessage = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(exportMessage)(req)
  responseMiddleware(res, statusCode, data)
}
