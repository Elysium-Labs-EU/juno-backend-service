import { gmail_v1 } from 'googleapis'
import { ALL_LABEL, USER } from '../../constants/globalConstants'

const requestBodyCreator = (req) => {
  const requestBody: gmail_v1.Params$Resource$Users$Threads$List = {
    userId: USER,
  }
  requestBody.maxResults =
    typeof Number(req.query.maxResults) !== 'number'
      ? 20
      : Number(req.query.maxResults)
  if (req.query.labelIds && req.query.labelIds !== 'undefined') {
    // If the label ALL is sent, don't send a label.
    if (req.query.labelIds !== ALL_LABEL) {
      requestBody.labelIds = req.query.labelIds
    }
  }
  if (req.query.pageToken) {
    requestBody.pageToken = req.query.pageToken
  }
  if (req.query.q) {
    requestBody.q = req.query.q
  }
  return requestBody
}

export default requestBodyCreator
