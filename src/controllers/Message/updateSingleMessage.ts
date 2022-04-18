import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const updateMessage = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.threads.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Message not found...')
  } catch (err) {
    throw Error(`Single message returned an error: ${err}`)
  }
}
export const updateSingleMessage = async (req, res) => {
  try {
    const auth = await authenticated(req.headers.authorization)
    const response = await updateMessage(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
