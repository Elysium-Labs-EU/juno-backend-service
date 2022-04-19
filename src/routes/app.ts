import express from 'express'
import 'dotenv/config'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import indexRoute from './index'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import assertNonNullish from '../utils/assertNonNullish'
import session from 'express-session'
import redis from 'connect-redis'
import initiateRedis from '../data/redis'

process.env.NODE_ENV !== 'production' && console.log('Booted')

const app = express()

const redisStore = redis(session)
const redisClient = initiateRedis()

app.use(
  session({
    store: new redisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: 'Shh, its a secret!',
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  })
)

app.use((req, res, next) => {
  assertNonNullish(
    process.env.FRONTEND_URL,
    'No Frontend environment variable found.'
  )
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
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
process.env.NODE_ENV !== 'development' &&
  process.env.SENTRY_DSN &&
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })

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
