import { config } from 'https://deno.land/x/dotenv/mod.ts'
import * as Sentry from 'npm:@sentry/node'
import compression from 'npm:compression'
import redis from 'npm:connect-redis'
import express from 'npm:express'
import type { Request } from 'npm:express'
import session from 'npm:express-session'
import { google } from 'npm:googleapis'
import helmet from 'npm:helmet'
import swaggerJSDoc from 'npm:swagger-jsdoc'
import swaggerUI from 'npm:swagger-ui-express'

import initiateRedis from '../data/redis.ts'
import assertNonNullish from '../utils/assertNonNullish.ts'
import customSession from '../utils/customSession.ts'
import initSentry from '../utils/initSentry.ts'
import indexRoute from './index.ts'

const env = config({ safe: true })

env.NODE_ENV !== 'production' && console.log('Booted and ready for usage')

const app = express()
const redisStore = redis(session)
const redisClient = initiateRedis()

// Compress all HTTP responses
// app.use(compression())

app.set('trust proxy', 1)

assertNonNullish(env.SESSION_SECRET, 'No Session Secret.')
const SEVEN_DAYS = 1000 * 60 * 10080
// app.use((req: any, res: any, next: any) => {
//   customSession(req)
// })

// app.use(
//   session({
//     name: 'junoSession',
//     store: new redisStore({ client: redisClient }),
//     saveUninitialized: false,
//     secret: env.SESSION_SECRET,
//     resave: false,
//     proxy: true,
//     cookie: {
//       secure: env.NODE_ENV !== 'production' ? false : true,
//       httpOnly: true,
//       maxAge: SEVEN_DAYS,
//       // sameSite: 'lax',
//       sameSite: env.NODE_ENV !== 'production' ? 'lax' : 'none',
//       domain: env.NODE_ENV !== 'production' ? undefined : env.COOKIE_DOMAIN,
//     },
//   })
// )

function determineAllowOrigin(req: Request) {
  assertNonNullish(env.FRONTEND_URL, 'No Frontend environment variable found.')
  if (env.NODE_ENV === 'production') {
    if (
      env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
      req.headers?.referer
    ) {
      return req.headers.referer.endsWith('/')
        ? req.headers.referer.slice(0, -1)
        : req.headers.referer
    }
    return env.FRONTEND_URL
  }
  return env.FRONTEND_URL
}

function determineAllowCredentials(req: Request) {
  if (env.NODE_ENV === 'production') {
    if (
      env.ALLOW_LOCAL_FRONTEND_WITH_CLOUD_BACKEND === 'true' &&
      req.headers?.referer &&
      req.headers.referer.includes('localhost')
    ) {
      return 'false'
    }
    return 'true'
  }
  return 'true'
}

// Helmet is used to set HTTP headers
app.use(helmet())
app.disable('x-powered-by')
app.use((req: any, res: any, next: any) => {
  customSession(req), res.setHeader('credentials', 'include')
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

// Don't run Sentry when developing.
env.NODE_ENV !== 'development' && initSentry(app)

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
app.use(function onError(err: any, req: any, res: any, next: any) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500
  res.end(res.sentry + '\n')
})

export default app
