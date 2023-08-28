/**
 * @type {import('express').RequestHandler}
 */
import fs from 'fs'
import bcrypt from 'bcrypt'

import { prisma } from '@database'

export default async (req, res) => {
  try {
    const { password, codeVerify } = req.body
    const hashPassword = await bcrypt.hash(password, 10)

    const listCodeVerify = JSON.parse(
      fs.readFileSync('code-verify.json', 'utf8')
    )

    const checkCodeVerify = listCodeVerify.find(
      code => code.codeVerify === codeVerify
    )

    if (checkCodeVerify === undefined) {
      return res.status(400).send({ message: 'Code verify not found!' })
    }

    const updatePassword = await prisma.user.update({
      where: {
        email: checkCodeVerify.email,
      },
      data: {
        password: hashPassword,
      },
    })

    const updateListCodeVerify = listCodeVerify.filter(
      code => code.email !== checkCodeVerify.email
    )

    fs.writeFile(
      'code-verify.json',
      JSON.stringify(updateListCodeVerify),
      err => {
        if (err) {
          return res.status(400).send({ message: 'Remove code verify failed!' })
        }
      }
    )

    if (updatePassword) {
      return res.status(200).send({ message: 'Forgot password successfully' })
    }
    res.status(400).send({ message: 'Forgot password failed!' })
  } catch (error) {
    res.status(400).send('Forgot password failed!')
  }
}
