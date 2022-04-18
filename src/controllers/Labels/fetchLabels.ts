import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const getLabels = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const response = await gmail.users.labels.list({
      userId: USER,
    })
    if (response?.data) {
      return response.data
    }
    return new Error('No Labels found...')
  } catch (err) {
    throw Error(`Labels returned an error: ${err}`)
  }
}
export const fetchLabels = async (req, res) => {
  try {
    const auth = await authenticated(req.session.oAuthClient)
    const response = await getLabels(auth)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
