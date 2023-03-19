import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import * as Tracing from '@sentry/tracing'

import assertNonNullish from './assertNonNullish'

export default function initSentry(app) {
  assertNonNullish(process.env.SENTRY_DSN, 'No Sentry DSN provided')

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
        new ProfilingIntegration(),
      ],
    })
  }
}
