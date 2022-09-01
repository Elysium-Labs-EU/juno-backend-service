import { gmail_v1 } from 'googleapis'
import { ARCHIVE_LABEL, USER } from '../../constants/globalConstants'

const requestBodyCreator = (req) => {
  const requestBody: gmail_v1.Params$Resource$Users$Threads$List = {
    userId: USER,
  }
  requestBody.maxResults =
    typeof Number(req.query.maxResults) !== 'number'
      ? 20
      : Number(req.query.maxResults)
  if (req.query.labelIds && req.query.labelIds !== 'undefined') {
    // If the label Archive label is sent, sent no label and replace it with a q parameter.
    if (req.query.labelIds !== ARCHIVE_LABEL) {
      requestBody.labelIds = req.query.labelIds
    } else {
      requestBody.q = '-label:inbox -label:sent -label:drafts -label:Juno/To Do'
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
