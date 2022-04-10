import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import ThirdParty from 'supertokens-node/recipe/thirdparty'
import assertNonNullish from '../utils/assertNonNullish'

const { Google } = ThirdParty

const superTokenInit = () => {
  assertNonNullish(
    process.env.SUPERTOKEN_CONNECTION_URI,
    'No SuperToken connectionURI found'
  )
  assertNonNullish(process.env.GOOGLE_CLIENT_ID, 'No Google ID found')
  assertNonNullish(
    process.env.GOOGLE_CLIENT_SECRET,
    'No Google Client Secret found'
  )
  assertNonNullish(process.env.BACKEND_URL, 'No Backend URL found')
  assertNonNullish(process.env.FRONTEND_URL, 'No Frontend URL found')

  console.log('here', process.env.BACKEND_URL)

  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.SUPERTOKEN_CONNECTION_URI,
      apiKey: process.env.SUPERTOKEN_API_KEY,
    },
    appInfo: {
      appName: 'Juno',
      apiDomain: process.env.BACKEND_URL,
      websiteDomain: process.env.FRONTEND_URL,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            Google({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signInUpPOST: async function (input) {
                if (originalImplementation.signInUpPOST === undefined) {
                  throw Error('Should never come here')
                }
                const response = await originalImplementation.signInUpPOST(
                  input
                )
                if (response.status === 'OK') {
                  const thirdPartyAuthCodeResponse = response.authCodeResponse
                  response.session.updateSessionData(thirdPartyAuthCodeResponse)
                }
                return response
              },
            }
          },
        },
      }),
      Session.init(),
    ],
  })
}

export default superTokenInit
