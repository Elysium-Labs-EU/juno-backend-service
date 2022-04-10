import { google } from 'googleapis'
import { SessionRequest } from 'supertokens-node/framework/express'

const authorize = async (token) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  )

  try {
    oAuth2Client.setCredentials(token)
    return oAuth2Client
  } catch (err) {
    console.log('err', JSON.stringify(err))
  }
}

export const authenticated = async (req: SessionRequest) => {
  const token = await req.session?.getSessionData()
  return await authorize(token)
}
