import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import handleHistoryObject from './handleHistoryObject'

const fetchHistory = async (auth, req) => {
  const gmail = google.gmail({ version: 'v1', auth })

  console.log(req)
  try {
    const { startHistoryId, storageLabels } = req.body.params
    console.log('storageLabels', storageLabels)
    const response = await gmail.users.history.list({
      userId: USER,
      historyTypes: ['labelAdded', 'labelRemoved', 'messageAdded'],
      startHistoryId,
    })
    if (response?.status === 200) {
      const { data } = response
      console.log('response.data', response.data)
      if (data?.history) {
        return {
          ...data,
          history: handleHistoryObject({
            history: data.history,
            storageLabels: storageLabels,
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
export const listHistory = async (req, res) => {
  authMiddleware(fetchHistory)(req, res)
}
