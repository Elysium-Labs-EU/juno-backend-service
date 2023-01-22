import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, gmail_v1, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import {
  gmailV1SchemaListThreadsResponseSchema,
  gmailV1SchemaThreadSchema,
} from '../../types/gmailTypes'
import threadFullRemap from '../../utils/threadRemap/threadFullRemap'
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
      if (response?.data) {
        gmailV1SchemaThreadSchema.parse(response.data)
        return response.data
      }
    }
    throw Error('Thread not found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Threads returned an error: ${err}`)
  }
}

const getFullThreads = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  const requestBody = requestBodyCreator(req)

  try {
    const response = await gmail.users.threads.list(requestBody)
    if (response && response.data) {
      gmailV1SchemaListThreadsResponseSchema.parse(response.data)
      const hydrateMetaList = async () => {
        const results: Promise<gmail_v1.Schema$Thread>[] = []

        const { threads } = response.data
        if (threads) {
          for (const thread of threads) {
            results.push(singleThread(thread, gmail))
          }
          const timeStampLastFetch = Date.now()
          const fetchedThreads = await Promise.all(results)
          const result = {
            ...response.data,
            threads: await Promise.all(
              fetchedThreads.map((thread) => threadFullRemap(thread, gmail))
            ),
            timestamp: timeStampLastFetch,
          }
          return result
        }
      }
      return hydrateMetaList()
    }
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}

export const fetchFullThreads = async (req: Request, res: Response) => {
  authMiddleware(getFullThreads)(req, res)
}
