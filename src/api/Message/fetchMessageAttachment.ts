import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

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
    throw Error(`Get Attachment returned an error: ${err}`)
  }
}
export const fetchMessageAttachment = async (req: Request, res: Response) => {
  authMiddleware(getAttachment)(req, res)
}