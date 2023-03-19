import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import type { people_v1 } from 'googleapis'

import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { peopleV1SchemaListOtherContactsResponseSchema } from '../../types/peopleTypes'
import errorHandeling from '../../utils/errorHandeling'

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
    if (response?.data) {
      peopleV1SchemaListOtherContactsResponseSchema.parse(response.data)
      return response.data
    }
    return new Error('No contacts found...')
  } catch (err) {
    errorHandeling(err, 'fetchAllContacts')
  }
}

export async function fetchAllContacts(req: Request, res: Response) {
  const { data, statusCode } = await authMiddleware(getContacts)(req)
  responseMiddleware(res, statusCode, data)
}
