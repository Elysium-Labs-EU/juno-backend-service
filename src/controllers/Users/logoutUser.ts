export const logoutUser = async (req, res) => {
  try {
    if (req.headers.authorization) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err)
          return res.status(401).json(err.message)
        }
        return res.status(205).json()
      })
    }
  } catch (err) {
    res.status(401).json(err.message)
  }
}
