import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import threadFullRemap from '../../utils/threadFullRemap'

const getThread = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.threads.get({
      userId: USER,
      id,
      format: 'full',
    })
    if (response && response.data) {
      const expandedResponse = await threadFullRemap(response.data, gmail)
      return expandedResponse
    }
    return new Error('Thread not found...')
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}
export const fetchSingleThread = async (req, res) => {
  authMiddleware(getThread)(req, res)
}
