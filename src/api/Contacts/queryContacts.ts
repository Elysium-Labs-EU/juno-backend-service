import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google, people_v1 } from 'googleapis'

import { authMiddleware } from '../../middleware/authMiddleware'
import { peopleV1SchemaSearchResponseSchema } from '../../types/peopleTypes'

const getContacts = async (auth: OAuth2Client | undefined, req: Request) => {
  const people = google.people({ version: 'v1', auth })

  const requestBody: people_v1.Params$Resource$Othercontacts$Search = {}
  if (typeof req.query.query === 'string') {
    requestBody.query = req.query.query
  }
  if (typeof req.query.readMask === 'string') {
    requestBody.readMask = req.query.readMask
  }

  try {
    const response = await people.otherContacts.search(requestBody)
    if (response?.data) {
      peopleV1SchemaSearchResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No contacts found...')
  } catch (err) {
    throw Error(`Contacts returned an error: ${err}`)
  }
}

export const queryContacts = async (req: Request, res: Response) => {
  authMiddleware(getContacts)(req, res)
}
