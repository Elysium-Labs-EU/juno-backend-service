import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { gmailV1SchemaListHistoryResponseSchema } from '../../types/gmailTypes'
import handleHistoryObject from './handleHistoryObject'

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
      if (data?.history) {
        return {
          ...data,
          history: handleHistoryObject({
            history: data.history,
            storageLabels,
          }),
        }
      }
      return data
    }
    return new Error('No history found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const listHistory = async (req: Request, res: Response) => {
  authMiddleware(fetchHistory)(req, res)
}
