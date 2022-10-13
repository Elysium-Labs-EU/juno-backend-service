import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
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
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const listHistory = async (req: Request, res: Response) => {
  authMiddleware(fetchHistory)(req, res)
}
