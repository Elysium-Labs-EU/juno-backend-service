import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const thrashSingleMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.messages.trash({
      userId: USER,
      id: req.params.id,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No message found...')
  } catch (err) {
    throw Error(`Single message return an error: ${err}`)
  }
}
export const thrashMessage = async (req, res) => {
  authMiddleware(thrashSingleMessage)(req, res)
}
