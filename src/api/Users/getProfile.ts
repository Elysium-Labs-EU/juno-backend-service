import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { gmailV1SchemaProfileSchema } from '../../types/gmailTypes'
import { peopleV1SchemaPersonSchema } from '../../types/peopleTypes'

const fetchProfile = async (auth: OAuth2Client | undefined) => {
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
        if (
          contactsResponse.value?.data?.names &&
          contactsResponse.value?.data?.names?.length > 0
        ) {
          return contactsResponse.value.data.names[0].displayName
        }
        return null
      }
      return {
        name: getName(),
        ...userResponse.value.data,
      }
    }
    return new Error('No profile found...')
  } catch (err) {
    if ((err as GaxiosError).response) {
      const error = err as Common.GaxiosError
      console.error(error.response)
      throw error
    }
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const getProfile = async (req: Request, res: Response) => {
  authMiddleware(fetchProfile)(req, res)
}
