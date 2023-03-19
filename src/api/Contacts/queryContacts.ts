import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google, people_v1 } from 'googleapis'

import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { peopleV1SchemaSearchResponseSchema } from '../../types/peopleTypes'
import errorHandeling from '../../utils/errorHandeling'
import remapContacts from './utils/remapContacts'

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
      return remapContacts({ results: response.data.results })
    }
    return new Error('No contacts found...')
  } catch (err) {
    errorHandeling(err, 'queryContacts')
  }
}

export const queryContacts = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(getContacts)(req)
  responseMiddleware(res, statusCode, data)
}
