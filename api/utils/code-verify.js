import fs from 'fs'

export default async email => {
  let code = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  const emailAndCodeVerification = {
    email: email,
    codeVerify: code,
    createdAt: new Date(),
  }

  let verifyCode = JSON.parse(fs.readFileSync('code-verify.json', 'utf8'))

  const checkTimeMailSend = verifyCode.find(
    emailAndcode => emailAndcode.email === email
  )
  if (checkTimeMailSend) {
    const timeNow = new Date()
    const createdAt = new Date(checkTimeMailSend.createdAt)
    const getSecond = (timeNow.getTime() - createdAt.getTime()) / 1000
    const minutes = Math.round(getSecond / 60)

    if (minutes < 5) {
      return {
        codeVerify: null,
        message: `Please resend the verification code in ${
          5 - minutes
        } minutes`,
      }
    }
  }

  verifyCode = verifyCode.filter(emailAndcode => emailAndcode.email !== email)

  const checkExistsCode = verifyCode.find(
    emailAndcode => emailAndcode.code === code
  )

  if (!checkExistsCode) {
    verifyCode.push(emailAndCodeVerification)
  }

  fs.writeFile('code-verify.json', JSON.stringify(verifyCode), err => {
    if (err) {
      return { codeVerify: null, message: 'Create code verify failed!' }
    }
  })

  return emailAndCodeVerification
}
