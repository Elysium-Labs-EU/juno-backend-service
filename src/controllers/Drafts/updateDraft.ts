import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import messageEncoding from '../../utils/messageEncoding'
import formFieldParser from '../../utils/formFieldParser'

const exportDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  // const { draftId, threadId, messageId, labelIds, mimeType } = req.body

  console.log('here2')

  try {
    if ('body' in req) {
      const parsedResult: any = await formFieldParser(req)
      const { draftId, threadId, messageId, labelIds } = parsedResult

      const response = await gmail.users.drafts.update({
        userId: USER,
        id: draftId,
        requestBody: {
          message: {
            raw: messageEncoding(parsedResult),
            id: messageId,
            threadId,
            labelIds,
            // payload: {
            //   partId: '',
            //   // mimeType: 'text/html',
            //   filename: '',
            //   body: {
            //     data: messageEncoding(req.body),
            //   },
            // },
          },
        },
      })
      if (response?.status === 200) {
        return response
      } else {
        return new Error('Draft is not updated...')
      }
    }
  } catch (err) {
    throw Error(`Draft update encountered an error ${err}`)
  }
}

export const updateDraft = async (req, res) => {
  authMiddleware(exportDraft)(req, res)
}
