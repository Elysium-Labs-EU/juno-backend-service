import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import jwt from 'jsonwebtoken'

const fetchProfile = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })
  // console.log('AUTH', jwt.decode(auth.credentials.id_token))
  try {
    const response = await gmail.users.getProfile({
      userId: USER,
    })
    // Inject the name and picture from the user based on the received id_token.
    const decodedJWT = jwt.decode(auth.credentials.id_token)
    if (
      decodedJWT &&
      typeof decodedJWT !== 'string' &&
      response?.status === 200
    ) {
      return {
        name: decodedJWT.name,
        picture: decodedJWT.picture,
        ...response.data,
      }
    }
    return new Error('No Profile found...')
  } catch (err) {
    throw Error(`Profile returned an error: ${err}`)
  }
}
export const getProfile = async (req, res) => {
  authMiddleware(fetchProfile)(req, res)
}
