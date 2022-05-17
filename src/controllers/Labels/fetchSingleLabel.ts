import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const getLabel = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.labels.get({
      userId: USER,
      id,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No Label found...')
  } catch (err) {
    throw Error(`Label returned an error: ${err}`)
  }
}
export const fetchSingleLabel = async (req, res) => {
  authMiddleware(getLabel)(req, res)
}
