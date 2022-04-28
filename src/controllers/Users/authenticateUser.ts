import { authenticate } from '../../google/index'
import * as global from '../../constants/globalConstants'

export const authenticateUser = async (req) => {
  const response = await authenticate({
    session: req.session?.oAuthClient,
    requestAccessToken: req.headers?.authorization,
  })
  if (response === global.INVALID_TOKEN) {
    throw Error(response)
  }
  if (response === global.INVALID_SESSION) {
    throw Error(response)
  }
  return response
}
