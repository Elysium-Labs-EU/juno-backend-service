// import { SessionRequest } from 'supertokens-node/framework/express'
import { gmail_v1, google } from 'googleapis'
import { authenticated } from '../../google/index'
import { USER } from '../../constants/globalConstants'
import requestBodyCreator from './threadRequest'

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
        format: 'full',
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

const getFullThreads = async (auth, req) => {
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
          return {
            ...response.data,
            threads: await Promise.all(results),
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

export const fetchFullThreads = async (req, res) => {
  try {
    const auth = await authenticated(req.headers.authorization)
    const response = await getFullThreads(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err)
  }
}
