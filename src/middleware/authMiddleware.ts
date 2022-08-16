import { authenticateUser } from '../controllers/Users/authenticateUser'

export const authMiddleware = (requestFunction) => async (req, res) => {
  try {
    const auth = await authenticateUser(req)
    const response = await requestFunction(auth, req)
    return res.status(200).json(response)
  } catch (err) {
    res.status(401).json(err?.message)
  }
}
