import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authenticateUser } from './authenticateUser'

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
    const auth = await authenticateUser(req)
    const response = await fetchProfile(auth)
    return res.status(200).json(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).json(err.message)
  }
}
