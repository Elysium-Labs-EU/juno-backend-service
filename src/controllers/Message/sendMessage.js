

const { google } = require('googleapis')
const { authenticated } = require('../../google/index')
const { USER } = require('../../constants/globalConstants')

const exportMessage = (auth, req) => new Promise((resolve, reject) => {
  const gmail = google.gmail({ version: 'v1', auth })
    
    const {body, subject, to, cc, sender, id, threadId} = req.body
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
    const messageParts = [
      `From: ${sender}`,
      `To: ${to}`,
      `Cc: ${cc}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      `${body}`,
    ]
    const message = messageParts.join('\n')

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
      function sendMail(encodedMessage) {
        return new Promise((resolve, reject) => {
          gmail.users.messages.send(
            {
              userId: USER,
              requestBody: {
                raw: encodedMessage,
                id,
                threadId,
              },
            },
            (err, res) => {
              if (err) {
                reject(err)
              }
              const mail = res
              if (mail !== null) {
                resolve(mail)
              } else {
                reject(new Error('Mail was not send...'))
              }
            }
          )
        })
      }
    const finalMail = sendMail(encodedMessage)
    if(finalMail) resolve(finalMail)
    reject(new Error('Mail was not send...'))

  })
exports.sendMessage = (req, res) => {
  authenticated
    .then((auth) => {
      exportMessage(auth, req).then((response) => {
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
