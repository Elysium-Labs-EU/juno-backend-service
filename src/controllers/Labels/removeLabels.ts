import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const removeTheLabels = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.labels.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`)
  }
}

export const removeLabels = async (req, res) => {
  authMiddleware(removeTheLabels)(req, res)
}
