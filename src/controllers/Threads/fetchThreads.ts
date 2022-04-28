import { google } from 'googleapis'
import { authMiddleware } from '../../middleware/authMiddleware'
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
  authMiddleware(getThreads)(req, res)
}
