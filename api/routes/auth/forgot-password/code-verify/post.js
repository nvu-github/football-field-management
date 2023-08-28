/**
 * @type {import('express').RequestHandler}
 */
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

import { prisma } from '@database'
import codeVerify from '@utils/code-verify'

export default async (req, res) => {
  try {
    const { email } = req.body

    const emailFound = await prisma.user.findUnique({
      where: { email },
    })

    if (!emailFound) {
      return res
        .status(400)
        .send({ message: 'Email does not exist in the system!' })
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.EMAIL_CLIENT_ID,
      process.env.EMAIL_CLIENT_SECRET
    )

    oAuth2Client.setCredentials({
      refresh_token: process.env.EMAIL_REFRESH_TOKEN,
    })

    const accessToken = await oAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken,
      },
    })

    const code = await codeVerify(email)

    if (!code.codeVerify) {
      return res.status(400).send({ message: code.message })
    }

    const mainOptions = {
      from: `ADMIN-AZ ${process.env.EMAIL_ADDRESS}`,
      to: email,
      subject: `Forgot pasword for ${email}`,
      html: `
      <p>Email login: <b> ${email} </b></p>
      <p>Verify code: <b> ${code.codeVerify} </b></p>`,
    }

    transporter.sendMail(mainOptions, function (err) {
      if (err)
        return res.status(400).send({ message: 'Send code verify failed!' })

      res.status(200).send({ message: 'Send code verify successfully' })
    })
  } catch (error) {
    res.status(400).send({ message: 'Send code verify failed!' })
  }
}
