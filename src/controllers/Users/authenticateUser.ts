import { authenticated } from '../../google/index'

export const authenticateUser = async (req, res) => {
  try {
    const response = await authenticated()
    req.session.oAuthClient = response.credentials
    return res.status(200).json({
      access_token: response.credentials.access_token,
      refresh_token: response.credentials.refresh_token,
    })
  } catch (err) {
    res.status(401).json(err)
  }
}
