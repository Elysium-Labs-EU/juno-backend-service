import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const fetchProfile = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })
  try {
    const response = await gmail.users.getProfile({
      userId: USER,
    })
    if (response?.status === 200) {
      return response.data
    }
    return new Error('No Profile found...')
  } catch (err) {
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const getProfile = async (req, res) => {
  try {
    // TODO: Extend the check by verifying the received sessionToken with the active one in the session.
    const auth = await authenticated(req.session.oAuthClient)
    const response = await fetchProfile(auth)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
