import { google } from 'googleapis'
import { authenticated } from '../../google/index'
import requestBodyCreator from './threadRequest'

const getThreads = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const requestBody = requestBodyCreator(req)

  try {
    const response = await gmail.users.threads.list(requestBody)
    if (response && response.data) {
      // const timeStampLastFetch = Date.now()
      return response.data
    }
    return new Error('No threads found...')
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}

export const fetchThreads = async (req, res) => {
  try {
    const auth = await authenticated(req.headers.authorization)
    const response = await getThreads(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
