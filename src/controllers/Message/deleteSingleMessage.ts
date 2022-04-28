import { google } from 'googleapis'
import { authenticate } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const deleteMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.threads.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error('Message not removed...')
  }
}
export const deleteSingleMessage = async (req, res) => {
  try {
    const auth = await authenticate({
      session: req.session?.oAuthClient,
      requestAccessToken: req.headers?.authorization,
    })
    const response = await deleteMessage(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
