import { Request, Response } from 'express'
import { GaxiosError } from 'googleapis-common'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const fetchSendAs = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { emailId } = req.query

  if (typeof emailId === 'string') {
    try {
      const response = await gmail.users.settings.sendAs.get({
        userId: USER,
        sendAsEmail: emailId,
      })
      if (response?.status === 200) {
        return response.data
      }
      return new Error('No data found...')
    } catch (err) {
      if ((err as GaxiosError).response) {
        const error = err as Common.GaxiosError
        console.error(error.response)
        throw error
      }
      throw Error(`Send as returned an error: ${err}`)
    }
  } else {
    throw Error('Invalid email id request')
  }
}
export const getSendAs = async (req: Request, res: Response) => {
  authMiddleware(fetchSendAs)(req, res)
}
