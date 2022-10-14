import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google, people_v1 } from 'googleapis'

import { authMiddleware } from '../../middleware/authMiddleware'

const getContacts = async (auth: OAuth2Client | undefined, req: Request) => {
  const people = google.people({ version: 'v1', auth })
  const requestBody: people_v1.Params$Resource$Othercontacts$List = {}

  requestBody.pageSize =
    typeof Number(req.query.pageSize) !== 'number'
      ? 1000
      : Number(req.query.pageSize)

  if (req.query.readMask && typeof req.query.readMask === 'string') {
    requestBody.readMask = req.query.readMask
  }
  if (req.query.pageToken && typeof req.query.pageToken === 'string') {
    requestBody.pageToken = req.query.pageToken
  }

  try {
    const response = await people.otherContacts.list(requestBody)
    if (response && response.data) {
      return response.data
    }
    return new Error('No contacts found...')
  } catch (err) {
    throw Error(`Contacts returned an error: ${err}`)
  }
}

export async function fetchAllContacts(req: Request, res: Response) {
  authMiddleware(getContacts)(req, res)
}
