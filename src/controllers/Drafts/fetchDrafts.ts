import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const getDrafts = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.drafts.list({
      userId: USER,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No drafts found...')
  } catch (err) {
    throw Error(`Drafts returned an error: ${err}`)
  }
}
export const fetchDrafts = async (req, res) => {
  authMiddleware(getDrafts)(req, res)
}
