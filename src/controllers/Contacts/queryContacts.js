const { google } = require('googleapis')
const { authenticated } = require('../../google/index')

const getContacts = (auth, req) => new Promise((resolve, reject) => {
  const people = google.people({ version: 'v1', auth })
  const { query } = req
  
    function listContacts() {
      const requestBody = {}
      requestBody.query = req.query.query
      requestBody.readMask = req.query.readMask
      
      return new Promise((resolve, reject) => {
        people.otherContacts.search(requestBody,
          (err, res) => {
            if (err) {
              reject(new Error(`Contacts returned an error: ${err}`))
            }
            if (res && res.data) {
              resolve(res.data)
            } else {
              reject(new Error('No contacts found...'))
            }
          }
        )
      })
    }
    if (query) {
      const threads = listContacts()
      resolve(threads)
    }
    reject(new Error('No contacts found...'))
})
  
exports.queryContacts = (req, res) => {
  authenticated
    .then((auth) => {
      getContacts(auth, req).then((response) => {
        res.status(200).json({
          message: response,
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
