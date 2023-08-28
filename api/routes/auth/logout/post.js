/**
 * @type {import('express').RequestHandler}
 */
import fs from 'fs'

export default async (req, res) => {
  let tokenFile = []
  const { token } = req
  const tokenLogout = JSON.parse(fs.readFileSync('token.json', 'utf8'))

  if (tokenLogout.length > 0) {
    tokenFile = tokenLogout
  }

  tokenFile.push(token)

  fs.writeFile('token.json', JSON.stringify(tokenFile), err => {
    if (err) {
      return res.status(400).send({ message: 'Logout failed!' })
    }
    res.status(200).send({ message: 'Logout successful' })
  })
}
