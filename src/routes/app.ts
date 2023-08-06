import 'dotenv/config'

import * as Sentry from '@sentry/node'
import compression from 'compression'
import RedisStore from 'connect-redis'
import express, { Request } from 'express'
import session from 'express-session'
import { google } from 'googleapis'
import helmet from 'helmet'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import initiateRedis from '../data/redis'
// import { expressErrorHandler } from '../middleware/expressErrorHandler'
import logger from '../middleware/loggerMiddleware'
import assertNonNullish from '../utils/assertNonNullish'
import initSentry from '../utils/initSentry'

import indexRoute from './index'

process.env.NODE_ENV !== 'production' &&
  // eslint-disable-next-line no-console
  console.log('Booted and ready for usage')

const app = express()
const redisClient = initiateRedis()
const redisStore = new RedisStore({
  client: redisClient.on('destroy', (sid) => {
    void logger?.info(`Session ${sid} was destroyed.`)
  }),
  prefix: 'juno:',
})

// Compress all HTTP responses
app.use(compression())

app.set('trust proxy', 1)

// Middleware for logging
const loggingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (process.env.NODE_ENV !== 'production' && logger && 'add' in logger) {
    logger.defaultMeta = { ...logger.defaultMeta, headers: req.headers }
  }
  if (logger && 'flush' in logger) {
    void logger.flush()
  }
  next()
}
app.use(loggingMiddleware)

app.use((req, res, next) => {
  // Check if session was just initialized.
  if (req.session && req.session.isNew && !req.session.oAuthClient) {
    void logger?.info('A new session was initialized.')

    // Remove isNew flag after logging it
    req.session.isNew = undefined
  }

  next()
})

app.use((req, res, next) => {
  // If there's a session, log its ID and the associated user ID.
  if (req.session) {
    void logger?.info(`Session ID: ${req.sessionID}`)
    if (req.session.oAuthClient) {
      void logger?.info(`User oAuthClient: ${req.session.oAuthClient}`)
    }
  }

  next()
})

assertNonNullish(process.env.SESSION_SECRET, 'No Session Secret.')
const SEVEN_DAYS = 1000 * 60 * 10080
app.use(
  session({
    name: 'junoSession',
    store: redisStore,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: true,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV !== 'production' ? false : true,
      httpOnly: true,
      maxAge: SEVEN_DAYS,
      sameSite: process.env.NODE_ENV !== 'production' ? 'strict' : 'none',
      domain:
        process.env.NODE_ENV !== 'production'
          ? undefined
          : process.env.COOKIE_DOMAIN,
    },
  })
)

// TODO: Expand this to allow for Tauri apps to connect to the cloud backend, without having to use insecure route.
const LOCALHOST_ORIGIN_TAURI = 'tauri://localhost'

function determineAllowOrigin(req: Request) {
  // Assert that the FRONTEND_URL environment variable is not null or undefined
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )

  // Check the value of the NODE_ENV environment variable
  switch (process.env.NODE_ENV) {
    case 'production': {
      // Check if the ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND environment variable is set to 'true'
      // and the req.headers.referer property is not null or undefined
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req.headers?.referer
      ) {
        // If the referer value ends with a '/' character, slice it off
        return req.headers.referer.endsWith('/')
          ? req.headers.referer.slice(0, -1)
          : req.headers.referer
      }

      // Check if the origin value is equal to the LOCALHOST_ORIGIN constant
      if (req.headers.origin === LOCALHOST_ORIGIN_TAURI) {
        return req.headers.origin
      }

      // Return the FRONTEND_URL environment variable
      return process.env.FRONTEND_URL
    }
    default: {
      // For all other values of NODE_ENV, return the FRONTEND_URL environment variable
      return process.env.FRONTEND_URL
    }
  }
}

function determineAllowCredentials(req: Request) {
  // Check the value of the NODE_ENV environment variable
  switch (process.env.NODE_ENV) {
    case 'production': {
      // Check if the ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND environment variable is set to 'true'
      // and the req.headers.referer property is not null or undefined and includes the string 'localhost'
      if (
        process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
        req.headers?.referer &&
        req.headers.referer.includes('localhost')
      ) {
        return 'false'
      }
      return 'true'
    }
    default: {
      // For all other values of NODE_ENV, return 'true'
      return 'true'
    }
  }
}

// Helmet is used to set HTTP headers
app.use(helmet())
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.setHeader('credentials', 'include')
  res.setHeader(
    'Access-Control-Allow-Credentials',
    determineAllowCredentials(req)
  )
  res.setHeader('Access-Control-Allow-Origin', determineAllowOrigin(req))
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.setHeader('Access-Control-Expose-Headers', ['set-cookie'])
  next()
})

app.use(express.json())

google.options({
  http2: true,
})

const swaggerDefinition = {
  info: {
    title: 'Juno API',
    version: '0.0.1',
    description:
      'This is a REST API application made with Express. It retrieves data from Gmail Api.',
    license: {
      name: 'Licensed under GNU General Public License v3.0',
      url: 'https://github.com/Elysium-Labs-EU/juno-backend/blob/main/LICENSE',
    },
    contact: {
      name: 'Robbert Tuerlings',
      url: 'https://robberttuerlings.online',
    },
  },
}

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./index.ts', './doc/definitions.yaml'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

// app.use('/', indexRoute)
// Don't run Sentry when developing.
process.env.NODE_ENV !== 'development' && initSentry(app)

// All controllers should live here
function rootHandler(req, res) {
  // Use the indexRoute router as middleware to handle the request
  indexRoute(req, res, () => {
    // This callback function will be called if no routes in indexRoute match the request
    res.status(404).send('Page not found')
  })
}

// Use the rootHandler function as middleware for the root path ("/")
app.use('/', rootHandler)

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// The error handler must be before any other error middleware and after all controllers
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      const regex = /Redis/
      const isRedisError = regex.test(error.toString())
      // eslint-disable-next-line no-console
      console.log('Error detected by Sentry:', error)
      // Capture all 401, 404 and 500 errors
      if (
        error.status === 401 ||
        error.status === 404 ||
        error.status === 500 ||
        isRedisError
      ) {
        return true
      }
      return false
    },
  }) as express.ErrorRequestHandler
)

// Optional fallthrough error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500
  res.end(res.sentry + '\n')
})

export default app
