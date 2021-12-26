const { google } = require('googleapis')
const {authenticated} = require('../../google/index')
const {USER} = require('../../constants/globalConstants')

const getThread = (auth, req) => new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: 'v1', auth })
    const threadId = req.params.id
    function singleThread() {
      return new Promise((resolve, reject) => {
        gmail.users.threads.get(
          {
            userId: USER,
            id: threadId,
            format: 'full',
          },
          (err, res) => {
            if (err) {
              reject(err)
            }
            if (res && res.data) {
              resolve(res.data)
            } else {
              reject(new Error('Thread not found...'))
            }
          }
        )
      })
    }
  
  const thread = singleThread()
  if(thread) resolve(thread)
  reject(new Error('Thread not found...'))
  })
exports.fetchSingleThread = (req, res) => {
  authenticated
    .then((auth) => {
      getThread(auth, req).then((response) => {
        res.status(200).json({
          thread: response,
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
