import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import messageEncoding from '../../utils/messageEncoding'

const exportDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { draftId, threadId, messageId, labelIds } = req.body

  try {
    const response = await gmail.users.drafts.update({
      userId: USER,
      id: draftId,
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
    return new Error('Draft is not updated...')
  } catch (err) {
    throw Error(`Draft update encountered an error ${err}`)
  }
}

export const updateDraft = async (req, res) => {
  authMiddleware(exportDraft)(req, res)
}
