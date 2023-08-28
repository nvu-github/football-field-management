import jwt from 'jsonwebtoken'
import fs from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '@database'

export default async (req, res, next) => {
  const { token } = req

  if (!token) return res.status(401).send({ message: 'Unauthorized' })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      const verifyWithGoogle = await verifyGoogleFirebase(token)

      if (!verifyWithGoogle) {
        return res.status(403).send({ message: 'Forbidden' })
      }
      const { sub, email } = verifyWithGoogle
      req.user = { id: sub, email }
      next()
    }

    const tokenFile = JSON.parse(fs.readFileSync('token.json', 'utf8'))
    const checkLogoutToken =
      tokenFile.length > 0
        ? tokenFile.find(token => token === req.token)
        : false
    if (checkLogoutToken) return res.status(403).send({ message: 'Forbidden' })

    const userFound = getUser(user.id)
    if (!userFound) return res.status(400).send({ message: 'User not found' })

    req.user = user
    next()
  })
}

async function getUser(id) {
  return await prisma.user.findUnique({
    where: {
      id: +id,
    },
  })
}

async function verifyGoogleFirebase(token) {
  try {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.WEB_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    return payload
  } catch (error) {
    return false
  }
}
