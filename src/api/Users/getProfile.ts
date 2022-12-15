import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { Common, google } from 'googleapis'
import { GaxiosError } from 'googleapis-common'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'

const fetchProfile = async (auth: OAuth2Client | undefined) => {
  const gmail = google.gmail({ version: 'v1', auth })
  const people = google.people({ version: 'v1', auth })
  try {
    const response = await gmail.users.getProfile({
      userId: USER,
    })
    const responseContacts = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    })
    if (response?.status === 200 && responseContacts?.status === 200) {
      const getName = () => {
        if (
          responseContacts?.data?.names &&
          responseContacts?.data?.names.length > 0
        ) {
          return responseContacts.data.names[0].displayName
        }
        return null
      }
      return {
        name: getName(),
        ...response.data,
      }
    }
    return new Error('No Profile found...')
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
