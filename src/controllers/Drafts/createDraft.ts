import { google } from 'googleapis'
import { authenticate } from '../../google/index'
import { USER } from '../../constants/globalConstants'
import messageEncoding from '../../utils/messageEncoding'

const setupDraft = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const { threadId, messageId, labelIds } = req.body

  try {
    const response = await gmail.users.drafts.create({
      userId: USER,
      // id: draftId,
      requestBody: {
        message: {
          raw: messageEncoding(req.body),
          id: messageId,
          threadId,
          labelIds,
          payload: {
            partId: '',
            mimeType: 'text/html',
            filename: '',
            body: {
              data: messageEncoding(req.body),
            },
          },
        },
      },
    })
    if (response) {
      return response
    }
    return new Error('Draft is not created...')
  } catch (err) {
    throw Error(`Create Draft returned an error ${err}`)
  }
}

export const createDraft = async (req, res) => {
  try {
    const auth = await authenticate({
      session: req.session?.oAuthClient,
      requestAccessToken: req.headers?.authorization,
    })
    const response = await setupDraft(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
