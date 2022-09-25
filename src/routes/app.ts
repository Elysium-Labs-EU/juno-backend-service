import express from 'express'
import 'dotenv/config'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import indexRoute from './index'
import * as Sentry from '@sentry/node'
import assertNonNullish from '../utils/assertNonNullish'
import session from 'express-session'
import redis from 'connect-redis'
import initiateRedis from '../data/redis'
import initSentry from '../utils/initSentry'
import compression from 'compression'

process.env.NODE_ENV !== 'production' &&
  console.log('Booted and ready for usage')

const app = express()
const redisStore = redis(session)
const redisClient = initiateRedis()

// Compress all HTTP responses
app.use(compression())

app.set('trust proxy', 1)

// Disable this option when the flag to use a local route, thus no session, is set and true
if (process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND !== 'true') {
  assertNonNullish(process.env.SESSION_SECRET, 'No Session Secret.')
  const SEVEN_DAYS = 1000 * 60 * 10080
  app.use(
    session({
      store: new redisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV !== 'production' ? false : true,
        httpOnly: true,
        maxAge: SEVEN_DAYS,
        sameSite: process.env.NODE_ENV !== 'production' ? 'lax' : 'none',
      },
    })
  )
}

function determineAllowOrigin(req) {
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )
  if (process.env.NODE_ENV === 'production') {
    if (process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true') {
      return req.headers?.referer
    }
    return process.env.FRONTEND_URL
  }
  return process.env.FRONTEND_URL
}

function determineAllowCredentials() {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true') {
      return 'false'
    }
    return 'true'
  }
  return 'true'
}

app.use((req, res, next) => {
  res.setHeader('credentials', 'include')
  res.setHeader('Access-Control-Allow-Credentials', determineAllowCredentials())
  res.setHeader('Access-Control-Allow-Origin', determineAllowOrigin(req))
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(express.json())

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

// Don't run Sentry when developing.
process.env.NODE_ENV !== 'development' && initSentry(app)

app.use('/', indexRoute)

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

// Optional fallthrough error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500
  res.end(res.sentry + '\n')
})

export default app
