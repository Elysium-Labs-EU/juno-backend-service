import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import messageEncoding from '../../utils/messageEncoding'

const setupDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { threadId, messageId, labelIds } = req.body

  try {
    const response = await gmail.users.drafts.create({
      userId: USER,
      // id: draftId,
      requestBody: {
        message: {
          raw: messageEncoding(req.body),
          id: messageId,
          threadId,
          labelIds,
          payload: {
            partId: '',
            mimeType: 'text/html',
            filename: '',
            body: {
              data: messageEncoding(req.body),
            },
          },
        },
      },
    })
    if (response) {
      return response
    }
    return new Error('Draft is not created...')
  } catch (err) {
    throw Error(`Create Draft returned an error ${err}`)
  }
}

export const createDraft = async (req, res) => {
  authMiddleware(setupDraft)(req, res)
}
