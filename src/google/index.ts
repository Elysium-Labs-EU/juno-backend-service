import { google } from 'googleapis'

const authorize = async (token) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  )

  // const parsedTokenObject = JSON.parse(token)
  // console.log(parsedTokenObject)

  try {
    const response = oAuth2Client.setCredentials(JSON.parse(token as string))
    console.log('RESPONSE', response)
    return response
  } catch (err) {
    console.log('err', JSON.stringify(err))
  }
}

export const authenticated = async (token: any) => {
  return await authorize(token)
}
