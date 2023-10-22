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
  whitelistOrigins: ['http://localhost:3000'],
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
});
