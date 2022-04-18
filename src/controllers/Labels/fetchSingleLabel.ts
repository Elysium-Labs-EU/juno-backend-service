import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const getLabel = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { id } = req.params

  try {
    const response = await gmail.users.labels.get({
      userId: USER,
      id,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('No Label found...')
  } catch (err) {
    throw Error(`Label returned an error: ${err}`)
  }
}
export const fetchSingleLabel = async (req, res) => {
  try {
    const auth = await authenticated(req.session.oAuthClient)
    const response = await getLabel(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
