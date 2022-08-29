import { gmail_v1, google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import requestBodyCreator from './threadRequest'
import { authMiddleware } from '../../middleware/authMiddleware'
import threadSimpleRemap from '../../utils/threadSimpleRemap'

async function singleThread(
  thread: gmail_v1.Schema$Thread,
  gmail: gmail_v1.Gmail
) {
  const { id } = thread
  try {
    if (id) {
      const response = await gmail.users.threads.get({
        userId: USER,
        id,
        format: 'metadata',
      })
      if (response && response.data) {
        return response.data
      }
    }
    throw Error('Thread not found...')
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}

const getSimpleThreads = async (auth, req) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  const requestBody = requestBodyCreator(req)

  try {
    const response = await gmail.users.threads.list(requestBody)
    if (response && response.data) {
      const hydrateMetaList = async () => {
        const results: Promise<gmail_v1.Schema$Thread>[] = []

        const threads = response.data.threads
        if (threads) {
          for (const thread of threads) {
            results.push(singleThread(thread, gmail))
          }
          const timeStampLastFetch = Date.now()
          const fetchedThreads = await Promise.all(results)
          return {
            ...response.data,
            threads: await Promise.all(
              fetchedThreads.map((thread) => threadSimpleRemap(thread))
            ),
            timestamp: timeStampLastFetch,
          }
        }
      }
      return hydrateMetaList()
    }
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}

export const fetchSimpleThreads = async (req, res) => {
  authMiddleware(getSimpleThreads)(req, res)
}
