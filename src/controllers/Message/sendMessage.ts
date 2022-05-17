import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import messageEncoding from '../../utils/messageEncoding'

const exportMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id, threadId } = req.body

  try {
    const response = await gmail.users.messages.send({
      userId: USER,
      requestBody: {
        raw: messageEncoding(req.body),
        id,
        threadId,
      },
    })
    if (response) {
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    throw Error(`Mail was not sent...: ${err}`)
  }
}
export const sendMessage = async (req, res) => {
  authMiddleware(exportMessage)(req, res)
}
