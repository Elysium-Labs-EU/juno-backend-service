import type { Request, Response } from 'npm:express'
import { OAuth2Client } from 'npm:google-auth-library'
import { Common, google } from 'npm:googleapis'
import { GaxiosError } from 'npm:googleapis-common'

import { USER } from '../../constants/globalConstants.ts'
import { authMiddleware } from '../../middleware/authMiddleware.ts'

const getAttachment = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { messageId } = req.params
  const attachmentId = req.params.id

  try {
    const response = await gmail.users.messages.attachments.get({
      userId: USER,
      messageId,
      id: attachmentId,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Message attachment not found4...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Get Attachment returned an error: ${err}`)
  }
}
export const fetchMessageAttachment = async (req: Request, res: Response) => {
  authMiddleware(getAttachment)(req, res)
}
