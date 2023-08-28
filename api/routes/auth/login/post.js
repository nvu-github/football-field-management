/**
 * @type {import('express').RequestHandler}
 */
import bcrypt from 'bcrypt'

import { prisma } from '@database'
import { generatesToken } from '@utils/jwt'

export default async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        email,
        deleted: false,
      },
    })

    if (!user) {
      return res.status(400).send({ message: 'User not found' })
    }

    const comparePassword = await bcrypt.compare(password, user.password)
    const accessToken = generatesToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })

    if (!comparePassword) {
      return res.status(400).send({ message: 'Password incorrect!' })
    }

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    })

    res.status(200).send({
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: 'Login failed!' })
  }
}
