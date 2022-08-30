import { authenticate } from '../../google/index'
import * as global from '../../constants/globalConstants'

export const authenticateUser = async (req) => {
  const response = await authenticate({
    session: req.session?.oAuthClient,
    idToken: req.headers?.authorization,
  })
  if (response === global.INVALID_TOKEN) {
    throw Error(response)
  }
  if (response === global.INVALID_SESSION) {
    throw Error(response)
  }
  if (response === 'Error during authorization') {
    throw Error(response)
  }
  return response
}
