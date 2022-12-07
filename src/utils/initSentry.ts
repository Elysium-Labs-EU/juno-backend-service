import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import assertNonNullish from './assertNonNullish'

export default function initSentry(app) {
  assertNonNullish(process.env.SENTRY_DSN, 'No Sentry DSN provided')

  if (process.env.SENTRY_DSN) {
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
  }
}
