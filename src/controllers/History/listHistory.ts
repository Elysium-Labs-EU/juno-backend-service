import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const fetchHistory = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const { startHistoryId } = req.query
    const response = await gmail.users.history.list({
      userId: USER,
      startHistoryId,
    })
    if (response && response.status === 200) {
      return response.data
    }
    return new Error('No history found...')
  } catch (err) {
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const listHistory = async (req, res) => {
  try {
    const auth = await authenticated(req.session.oAuthClient)
    const response = await fetchHistory(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
