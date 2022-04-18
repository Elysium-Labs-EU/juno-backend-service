import { OAuth2Client } from 'google-auth-library'
import http from 'http'
import url from 'url'
import open from 'open'
import destroyer from 'server-destroy'
import assertNonNullish from '../utils/assertNonNullish'

const SCOPES = [
  'openid',
  'profile',
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.other.readonly',
]

const getNewRefreshToken = async (token: any) => {
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(
    process.env.GOOGLE_REDIRECT_URL,
    'No Google Redirect URL found'
  )
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  )

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.

    assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
    assertNonNullish(
      process.env.GOOGLE_CLIENT_SECRET,
      'No Google Client Secret found'
    )
    assertNonNullish(
      process.env.GOOGLE_REDIRECT_URL,
      'No Google Redirect URL found'
    )

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    )

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server: any = http
      .createServer(async (req, res) => {
        try {
          if (req?.url && req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3001')
              .searchParams
            const code = qs.get('code')
            // console.log('code', code)
            res.end(
              '<p>Authentication successful! Please return to the console.</p>'
            )
            server.destroy()
            if (code) {
              // Now that we have the code, use that to acquire tokens.
              const r = await oAuth2Client.getToken(code)
              // console.log('@@R@@', r)
              // Make sure to set the credentials on the OAuth2 client.
              oAuth2Client.setCredentials(r.tokens)
              resolve(oAuth2Client)
            }
          }
        } catch (e) {
          reject(e)
        }
      })
      .listen(3001, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref())
      })
    destroyer(server)
  })
}

async function main() {
  const oAuth2Client: any = await getAuthenticatedClient()
  if (oAuth2Client) {
    // After acquiring an access_token, you may want to check on the audience, expiration,
    // or original scopes requested.  You can do that with the `getTokenInfo` method.
    const tokenInfo = await oAuth2Client.getTokenInfo(
      oAuth2Client.credentials.access_token
    )

    if (tokenInfo.expiry_date > Math.floor(new Date().getTime())) {
      return oAuth2Client
    }
    throw Error(`Expiration date before current date.`)
  }
}

const authorize = async (token) => {
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  )

  try {
    oAuth2Client.setCredentials(token)
    return oAuth2Client
  } catch (err) {
    return getNewRefreshToken(token)
    console.log('err', JSON.stringify(err))
  }
}

export const authenticated = async (token: any) => {
  try {
    if (token) {
      const response = await authorize({ access_token: token })
      // console.log(response)
      return response
    }
    const response = await main()
    return response
  } catch (err) {
    console.error(err)
  }
}
