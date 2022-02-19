import { OAuth2Client } from 'google-auth-library'

const CLIENT_ID =
  '113671319507-9mhst0qa3kq4e5g55u4q8gl1af0k2dk0.apps.googleusercontent.com'

const client = new OAuth2Client(CLIENT_ID)
// const client = new OAuth2Client(process.env.CLIENT_ID)

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body
    console.log(token)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })

    console.log('WHATSUP', ticket)

    //   req.session.userId = user.id

    //   const { name, email, picture } = ticket.getPayload()
    // const user = await db.user.upsert({
    //     where: { email: email },
    //     update: { name, picture },
    //     create: { name, email, picture }
    // })

    res.status(201).json(ticket)
  } catch (err) {
    res.status(401).json(err)
  }
}
