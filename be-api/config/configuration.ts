export default () => ({
  port: process.env.PORT || 8081,
  portSocket: process.env.PORT_SOCKET || 8082,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES,
  },
  salt: process.env.SALT,
  whitelistOrigins: [],
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  payment: {
    vnpayUrl: process.env.VNPAY_URL,
    vnpayApi: process.env.VNPAY_API,
    tmnCodeVnPay: process.env.VNPAY_TMN_CODE,
    secretKeyVnPay: process.env.VNPAY_SECRET_KEY,
    returnUrlVnPay: process.env.VNPAY_RETURN_URL,
  },
  mail: {
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    address: process.env.EMAIL_ADDRESS,
  },
});
