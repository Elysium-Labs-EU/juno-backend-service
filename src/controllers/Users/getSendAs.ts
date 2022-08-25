import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const fetchSendAs = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { emailId } = req.query

  try {
    const response = await gmail.users.settings.sendAs.get({
      userId: USER,
      sendAsEmail: emailId,
    })
    if (response?.status === 200) {
      return response.data
    }
    return new Error('No data found...')
  } catch (err) {
    throw Error(`Send as returned an error: ${err}`)
  }
}
export const getSendAs = async (req, res) => {
  authMiddleware(fetchSendAs)(req, res)
}
