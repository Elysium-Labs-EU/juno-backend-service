import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import handleHistoryObject from './handleHistoryObject'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaListHistoryResponseSchema } from '../../types/gmailTypes'
import errorHandeling from '../../utils/errorHandeling'
import { hydrateMetaList } from '../Threads/fetchSimpleThreads'

const fetchHistory = async (auth: OAuth2Client | undefined, req: Request) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const { startHistoryId, storageLabels } = req.body.params
    const response = await gmail.users.history.list({
      userId: USER,
      historyTypes: ['labelAdded', 'labelRemoved', 'messageAdded'],
      startHistoryId,
    })
    if (response?.status === 200 && storageLabels) {
      gmailV1SchemaListHistoryResponseSchema.parse(response.data)
      const { data } = response
      if (!data.history) {
        const emptyResponse = {
          labels: [],
          threads: [],
        }
        return [emptyResponse]
      }

      const history = handleHistoryObject({
        history: data.history,
        storageLabels,
      })

      const timeStampLastFetch = Date.now()
      const hydratedOutput = await Promise.all(
        history.map((historyItem) =>
          hydrateMetaList({
            gmail,
            timeStampLastFetch,
            response: historyItem,
          })
        )
      )

      return hydratedOutput
    }
    return new Error('No history found...')
  } catch (err) {
    errorHandeling(err, 'listHistory')
  }
}
export const listHistory = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(fetchHistory)(req)
  responseMiddleware(res, statusCode, data)
}
