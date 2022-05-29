import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const fetchHistory = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const { startHistoryId } = req.query
    const response = await gmail.users.history.list({
      userId: USER,
      historyTypes: ['labelAdded', 'labelRemoved', 'messageAdded'],
      startHistoryId,
    })
    if (response?.status === 200) {
      return response.data
    }
    return new Error('No history found...')
  } catch (err) {
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const listHistory = async (req, res) => {
  authMiddleware(fetchHistory)(req, res)
}
