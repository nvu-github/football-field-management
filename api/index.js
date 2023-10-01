import express from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import promiseRouter from 'express-promise-router'
// import nnnRouter from '@middleware/nnn-router'
import nnnRouter from './middleware/nnn-router'
import cors from 'cors'
import statuses from 'statuses'
// import { NODE_ENV_LIST } from '@const/index'
import { NODE_ENV_LIST } from '@const/index'
import cookieParser from 'cookie-parser'

// Customize express response
express.response.sendStatus = function (statusCode) {
  const body = { message: statuses(statusCode) || String(statusCode) }
  this.statusCode = statusCode
  this.type('json')
  this.send(body)
}

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
  express.urlencoded({ extended: true }),
  express.json({ limit: '50MB' })
)

app.use(cookieParser())

app.use(
  // OpenApiValidator.middleware({
  //   apiSpec: 'references/openapi.yml',
  //   validateRequests: true,
  //   validateResponses: true,
  // }),
  nnnRouter({
    routeDir: 'routes',
    baseRouter: promiseRouter(),
    debug: process.env.NODE_ENV === NODE_ENV_LIST.development,
  }),
)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
