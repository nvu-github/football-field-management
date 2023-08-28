/**
 * @type {import('express').RequestHandler}
 */

import bcrypt from 'bcrypt'

import { prisma } from '@database'

export default async (req, res) => {
  try {
    const { username, email, phoneNumber, dateOfBirth, gender, password } =
      req.body
    const hashPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    })

    if (user) {
      if (user.email === email) {
        return res.status(400).send({ message: 'Email already exists!' })
      }
      if (user.phoneNumber === phoneNumber) {
        return res.status(400).send({ message: 'Phone number already exists' })
      }
    }

    const addUser = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        password: hashPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    })

    if (addUser) {
      res.status(200).send({
        message: 'Created user success!',
        data: addUser,
      })
    }
  } catch (error) {
    res.status(400).send({ message: 'Create user failed!' })
  }
}
