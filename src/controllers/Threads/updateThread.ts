import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const updateSingleThread = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.threads.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    throw Error(`Single message returned an error: ${err}`)
  }
}
export const updateThread = async (req, res) => {
  authMiddleware(updateSingleThread)(req, res)
}
