import { google } from 'googleapis'
import { authenticate } from '../../google/index'
import { USER } from '../../constants/globalConstants'
import messageEncoding from '../../utils/messageEncoding'

const exportMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id, threadId } = req.body

  try {
    const response = await gmail.users.messages.send({
      userId: USER,
      requestBody: {
        raw: messageEncoding(req.body),
        id,
        threadId,
      },
    })
    if (response) {
      return response
    }
    return new Error('Mail was not sent...')
  } catch (err) {
    throw Error(`Mail was not sent...: ${err}`)
  }
}
export const sendMessage = async (req, res) => {
  try {
    const auth = await authenticate({
      session: req.session?.oAuthClient,
      requestAccessToken: req.headers?.authorization,
    })
    const response = await exportMessage(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
