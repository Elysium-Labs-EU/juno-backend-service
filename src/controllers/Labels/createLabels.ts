import { SessionRequest } from 'supertokens-node/framework/express'
import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const newLabels = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const {
      body: { labelListVisibility, messageListVisibility, name },
    } = req
    const response = gmail.users.labels.create({
      userId: USER,
      requestBody: {
        labelListVisibility,
        messageListVisibility,
        name,
      },
    })
    return response
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`)
  }
}
export const createLabels = async (req: SessionRequest, res) => {
  try {
    const auth = await authenticated(req)
    const response = await newLabels(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
