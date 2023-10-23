export default () => ({
  port: process.env.PORT || 8080,
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
    tmnCodeVnPay: process.env.VNPAY_TMN_CODE,
    secretKeyVnPay: process.env.VNPAY_SECRET_KEY,
    returnUrlVnPay: process.env.VNPAY_RETURN_URL
  }
});
