import { gmail_v1, google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const refreshLabels = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id, requestBody },
  }: {
    body: {
      id: string
      requestBody: gmail_v1.Params$Resource$Users$Labels$Update
    }
  } = req

  try {
    const response = await gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No labels created...')
  } catch (err) {
    throw new Error(`Create labels returned an error: ${err}`)
  }
}
export const updateLabels = async (req, res) => {
  authMiddleware(refreshLabels)(req, res)
}
