import { authenticateUser } from '../controllers/Users/authenticateUser'

export const authMiddleware = (requestFunction) => async (req, res) => {
  try {
    const auth = await authenticateUser(req)
    const response = await requestFunction(auth, req)
    console.log('final response', response)
    return res.status(200).json(response)
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.error(err)
    res.status(401).json(err?.message)
  }
}
