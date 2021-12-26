const { google } = require('googleapis')
const {authenticated} = require('../../google/index')
const { USER } = require('../../constants/globalConstants')

const getAttachment = (auth, req) => new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: 'v1', auth })
    const { messageId } = req.params
    const attachmentId = req.params.id

  
  function singleMessageAttachments() {
    if (messageId && attachmentId) {
      return new Promise((resolve, reject) => {
        gmail.users.messages.attachments.get(
          {
            userId: USER,
            messageId,
            id: attachmentId,
          },
          (err, res) => {
            if (err) {
              reject(new Error(`Get Attachment returned an error: ${err}`))
            }
            if (res && res.data) {
              resolve(res.data)
            } else {
              reject(new Error ('Message attachment not found...'))
            }
          }
        )
      })}
      return null
  }
  

    const messageAttachment = singleMessageAttachments()
    if(messageAttachment) resolve(messageAttachment)
    reject(new Error ('Message attachment not found...'))
  })
exports.fetchMessageAttachment = (req, res) => {
  authenticated
    .then((auth) => {
      getAttachment(auth, req).then((response) => {
        res.status(200).json({
          messageAttachment: response,
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
