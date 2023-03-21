import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaProfileSchema } from '../../types/gmailTypes'
import { extendedGmailV1SchemaProfileSchemaSchema } from '../../types/otherTypes'
import { peopleV1SchemaPersonSchema } from '../../types/peopleTypes'
import errorHandeling from '../../utils/errorHandeling'

export const fetchProfile = async (auth: OAuth2Client | undefined) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const people = google.people({ version: 'v1', auth })
  try {
    const [userResponse, contactsResponse] = await Promise.allSettled([
      gmail.users.getProfile({
        userId: USER,
      }),
      people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
      }),
    ])

    if (
      userResponse.status === 'fulfilled' &&
      contactsResponse.status === 'fulfilled'
    ) {
      gmailV1SchemaProfileSchema.parse(userResponse.value.data)
      peopleV1SchemaPersonSchema.parse(contactsResponse.value.data)
      const getName = () => {
        const displayName =
          contactsResponse?.value?.data?.names?.at(0)?.displayName
        return displayName
      }
      const result = {
        name: getName(),
        ...userResponse.value.data,
      }
      const validatedResponse =
        extendedGmailV1SchemaProfileSchemaSchema.parse(result)
      return validatedResponse
    }
    return new Error('No profile found...')
  } catch (err) {
    errorHandeling(err, 'getProfile')
  }
}
export const getProfile = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(fetchProfile)(req)
  responseMiddleware(res, statusCode, data)
}
