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
import threadSimpleRemap from '../../utils/threadRemap/threadSimpleRemap'
import type { IFeedModel } from '../History/handleHistoryObject'
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

/**
 * Function to hydrate the list of threads received from the Gmail API by fetching additional information on each thread.
 * @param {Object} param - An object containing required parameters
 * @param {gmail_v1.Gmail} param.gmail - The Gmail client object used to make requests
 * @param {gmail_v1.Schema$ListThreadsResponse} param.response - The response object received from the Gmail API containing the list of threads
 * @param {number} param.timeStampLastFetch - A timestamp representing the last time the threads were fetched
 * @returns {Promise<Object>} - Returns an object containing the fetched threads and timestamp
 */

export const hydrateMetaList = async ({
  gmail,
  response,
  timeStampLastFetch,
}: {
  gmail: gmail_v1.Gmail
  response: gmail_v1.Schema$ListThreadsResponse | IFeedModel
  timeStampLastFetch: number
}) => {
  const results: Array<Promise<gmail_v1.Schema$Thread>> = []

  const { threads } = response
  if (threads) {
    for (const thread of threads) {
      if (thread) {
        results.push(singleThread(thread, gmail))
      }
    }
    const fetchedThreads = await Promise.all(results)
    const result = {
      nextPageToken: null,
      ...response,
      threads: await Promise.all(
        fetchedThreads.map((thread) => threadSimpleRemap(thread))
      ),
      timestamp: timeStampLastFetch,
    }
    return result
  }
}

const getSimpleThreads = async (
  auth: OAuth2Client | undefined,
  req: Request
) => {
  const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth })
  const requestBody = requestBodyCreator(req)

  try {
    const response = await gmail.users.threads.list(requestBody)
    const timeStampLastFetch = Date.now()
    if (
      !response ||
      !response?.data ||
      response.data.resultSizeEstimate === 0
    ) {
      return {
        nextPageToken: null,
        threads: [],
        timestamp: timeStampLastFetch,
        ...response.data,
      }
    }
    gmailV1SchemaListThreadsResponseSchema.parse(response.data)
    const output = await hydrateMetaList({
      gmail,
      response: response.data,
      timeStampLastFetch,
    })
    return output
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`)
  }
}

export const fetchSimpleThreads = async (req: Request, res: Response) => {
  authMiddleware(getSimpleThreads)(req, res)
}
