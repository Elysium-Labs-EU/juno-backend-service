import type { Request } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import QueryString from 'qs'

import { USER } from '../../constants/globalConstants'
import { gmailV1SchemaSendAsSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'

export const fetchSendAs = async (
  auth: OAuth2Client | undefined,
  req: Request | string
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  let emailId:
    | QueryString.ParsedQs
    | Array<QueryString.ParsedQs>
    | string
    | Array<string>
    | undefined = ''

  if (typeof req === 'string') {
    emailId = req
  } else {
    emailId = req.query.emailId
  }

  if (typeof emailId === 'string') {
    try {
      const response = await gmail.users.settings.sendAs.get({
        userId: USER,
        sendAsEmail: emailId,
      })
      if (response?.data) {
        gmailV1SchemaSendAsSchema.parse(response.data)
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      errorHandeling(err, 'getSendAs')
    }
  } else {
    throw Error('Invalid email id request')
  }
}
