import { Request, Response } from 'express'
import { GaxiosError } from 'googleapis-common'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const updateSendAsGmail = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { emailId, request } = req.body.params

  try {
    const response = await gmail.users.settings.sendAs.update({
      userId: USER,
      sendAsEmail: emailId,
      requestBody: {
        signature: request.signature,
      },
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
}
export const updateSendAs = async (req: Request, res: Response) => {
  authMiddleware(updateSendAsGmail)(req, res)
}
