import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const removeDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.drafts.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error(`Draft returned an error: ${err}`)
  }
}
export const deleteDraft = async (req, res) => {
  authMiddleware(removeDraft)(req, res)
}
