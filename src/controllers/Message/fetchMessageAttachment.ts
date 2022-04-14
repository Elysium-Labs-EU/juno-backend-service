// import { SessionRequest } from 'supertokens-node/framework/express'
import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'

const getAttachment = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { messageId } = req.params
  const attachmentId = req.params.id

  try {
    const response = await gmail.users.messages.attachments.get({
      userId: USER,
      messageId,
      id: attachmentId,
    })
    if (response && response.data) {
      return response.data
    }
    return new Error('Message attachment not found...')
  } catch (err) {
    throw Error(`Get Attachment returned an error: ${err}`)
  }
}
export const fetchMessageAttachment = async (req, res) => {
  try {
    const auth = await authenticated(req.headers.authorization)
    const response = await getAttachment(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
