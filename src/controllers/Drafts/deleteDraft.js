const { google } = require('googleapis')
const { authenticated } = require('../../google/index')
const { USER } = require('../../constants/globalConstants')

const removeDraft = (auth, req) => new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: 'v1', auth })
    const { body } = req
  
    function removeSingleDraft() {
      const { id } = body
      return new Promise((resolve, reject) => {
        gmail.users.drafts.delete(
          {
            userId: USER,
            id,
          },
          (err, res) => {
            if (err) {
              reject(new Error(`Draft returned an error: ${  err}`))
            }
            if (res && res.status === 204) {
              resolve(res)
            } else {
              reject(new Error('No draft deleted...'))
            }
          }
        )
      })
    }
    if (body) {
      const removedDraft = removeSingleDraft()
      resolve(removedDraft)
    }
    if (!body) {
      reject(new Error('No draft deleted...'))
    }
  })
exports.deleteDraft = (req, res) => {
  authenticated
    .then((auth) => {
      removeDraft(auth, req).then((response) => {
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
