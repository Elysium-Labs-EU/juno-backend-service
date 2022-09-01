import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const thrashSingleThread = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.threads.trash({
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
export const thrashThread = async (req, res) => {
  authMiddleware(thrashSingleThread)(req, res)
}
