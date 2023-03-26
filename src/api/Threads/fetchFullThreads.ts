import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1, google } from 'googleapis'

import requestBodyCreator from './threadRequest'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import {
  gmailV1SchemaListThreadsResponseSchema,
  gmailV1SchemaThreadSchema,
} from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
import threadFullRemap from '../../utils/threadRemap/threadFullRemap'

async function singleThread(
  thread: gmail_v1.Schema$Thread,
  gmail: gmail_v1.Gmail
) {
  try {
    const { id } = thread

    if (id) {
      const response = await gmail.users.threads.get({
        userId: USER,
        id,
        format: 'full',
      })

      if (!response.data) {
        throw Error('Thread not found...')
      }
      const validatedData = gmailV1SchemaThreadSchema.parse(response.data)
      return validatedData
    }
    throw Error('Thread not found...')
  } catch (err) {
    errorHandeling(err, 'singleThread')
  }
}

const getFullThreads = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  const requestBody = requestBodyCreator(req)

  try {
    const response = await gmail.users.threads.list(requestBody)
    if (!response || !response.data) {
      throw new Error('Invalid response on listing threads')
    }

    gmailV1SchemaListThreadsResponseSchema.parse(response.data)
    const hydrateMetaList = async () => {
      // const results: Promise<gmail_v1.Schema$Thread>[] = []

      const { threads } = response.data
      if (!threads) {
        throw new Error('No threads found in response')
      }

      const timeStampLastFetch = Date.now()
      const fetchedThreads = await Promise.all(
        threads.map((thread) => singleThread(thread, gmail))
      )
      const result = {
        ...response.data,
        threads: await Promise.all(
          fetchedThreads.map(
            (thread) => thread && threadFullRemap(thread, gmail)
          )
        ),
        timestamp: timeStampLastFetch,
      }
      return result
    }

    return hydrateMetaList()
  } catch (err) {
    errorHandeling(err, 'fetchFullThreads')
  }
}

export const fetchFullThreads = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(getFullThreads)(req)
  responseMiddleware(res, statusCode, data)
}
