import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const deleteSingleMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.messages.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error('Message not removed...')
  }
}
export const deleteMessage = async (req, res) => {
  authMiddleware(deleteSingleMessage)(req, res)
}
