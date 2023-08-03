import { Logtail } from '@logtail/node'
import winston from 'winston'

// import assertNonNullish from '../utils/assertNonNullish'

const isDevelopment = process.env.NODE_ENV !== 'production'
const logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN

// assertNonNullish(
//   logtailSourceToken,
//   'No LOGTAIL_SOURCE_TOKEN defined'
// )

const logger = isDevelopment
  ? winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'juno-backend' },
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    })
  : logtailSourceToken
  ? new Logtail(logtailSourceToken)
  : undefined

if (isDevelopment && logger && 'add' in logger) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

export default logger
