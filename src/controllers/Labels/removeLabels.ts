import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const removeTheLabels = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const {
    body: { id },
  } = req

  try {
    const response = await gmail.users.labels.delete({
      userId: USER,
      id,
    })
    return response
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`)
  }
}

export const removeLabels = async (req, res) => {
  try {
    const auth = await authenticated(req.session.oAuthClient)
    const response = await removeTheLabels(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
