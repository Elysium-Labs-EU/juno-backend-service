import {
  authenticateUserLocal,
  authenticateUserSession,
} from '../controllers/Users/authenticateUser'

export const authMiddleware = (requestFunction) => async (req, res) => {
  try {
    // A boolean to determine if the local or session authorization route should be used.
    const useLocalRoute =
      typeof JSON.parse(req.headers?.authorization) === 'object'
    const auth = useLocalRoute
      ? await authenticateUserLocal(req)
      : await authenticateUserSession(req)
    const response = await requestFunction(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.error(err)
    res.status(401).json(err?.message)
  }
}
