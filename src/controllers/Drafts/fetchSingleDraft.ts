import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const getDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.get({
      userId: USER,
      id: req.params.id,
      format: 'full',
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Draft not found...')
  } catch (err) {
    throw Error(`Fetching Draft returned an error ${err}`)
  }
}
export const fetchSingleDraft = async (req, res) => {
  authMiddleware(getDraft)(req, res)
}
