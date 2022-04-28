import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const exportDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.body

  try {
    const response = await gmail.users.drafts.send({
      userId: USER,
      requestBody: {
        id,
      },
    })
    if (response) {
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    throw Error(`Sending Draft encountered an error ${err}`)
  }
}
export const sendDraft = async (req, res) => {
  authMiddleware(exportDraft)(req, res)
}
