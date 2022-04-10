import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import ThirdParty from 'supertokens-node/recipe/thirdparty'

const { Google } = ThirdParty

const superTokenInit = () => {
  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI:
        'https://32c65ca1b5ed11ec98ed89cb2be9b480-eu-west-1.aws.supertokens.io:3573',
      apiKey: 'WvdaQbza9=0uGNeDyoWaRdcCx9yiff',
    },
    appInfo: {
      appName: 'Juno',
      apiDomain: 'http://localhost:5001',
      websiteDomain: 'http://localhost:3000',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            Google({
              clientId:
                '113671319507-5t9giuht80llorc8i6041e4upaor3k81.apps.googleusercontent.com',
              clientSecret: 'AKOKH58HYZKrvPJxgB5bUvTe',
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
