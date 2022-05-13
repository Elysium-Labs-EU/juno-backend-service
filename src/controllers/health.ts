export const health = async (req, res) => {
  try {
    const response = 'I am healthy.'
    return res.status(200).json(response)
  } catch (err) {
    const errResponse = 'I am unhealthy.'
    res.status(401).json(errResponse)
  }
}
