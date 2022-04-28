import { google, people_v1 } from 'googleapis'
import { authMiddleware } from '../../middleware/authMiddleware'

const getContacts = async (auth, req) => {
  const people = google.people({ version: 'v1', auth })

  const requestBody: people_v1.Params$Resource$Othercontacts$Search = {}
  requestBody.query = req.query.query
  requestBody.readMask = req.query.readMask
  try {
    const response = await people.otherContacts.search(requestBody)
    if (response && response.data) {
      return response.data
    }
    return new Error('No contacts found...')
  } catch (err) {
    throw Error(`Contacts returned an error: ${err}`)
  }
}

export const queryContacts = async (req, res) => {
  authMiddleware(getContacts)(req, res)
}
