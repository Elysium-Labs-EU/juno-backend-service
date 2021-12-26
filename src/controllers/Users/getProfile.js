const { google } = require('googleapis')
const { authenticated } = require('../../google/index')
const {USER} = require('../../constants/globalConstants')

const fetchProfile = (auth) => new Promise((resolve, reject) => {
  const gmail = google.gmail({ version: 'v1', auth })
  
  function listUser() {
      return new Promise((resolve, reject) => {
        gmail.users.getProfile(
          {
            userId: USER,
          },
          (err, res) => {
            if (err) {
              reject(new Error(`Profile returned an error: ${  err}`))
            }
            if (res && res.data) {
              resolve(res.data)
            } else {
              reject(new Error('No Profile found...'))
            }
          }
        )
      })
    }
    const user = listUser()
    if (user) resolve(user)
    reject(new Error('No Profile found...'))

  })
exports.getProfile = (req, res) => {
  authenticated
    .then((auth) => {
      fetchProfile(auth).then((response) => {
        res.status(200).json({
          data: response,
        })
      })
    })
    .catch((err) => {
      res.status(404).json(err)
    })
    .catch((err) => {
      res.status(401).json(err)
    })
}
