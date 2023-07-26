import { Logtail } from '@logtail/node'
import winston from 'winston'

import assertNonNullish from '../utils/assertNonNullish'

const isDevelopment = process.env.NODE_ENV !== 'production'

assertNonNullish(
  isDevelopment ? '' : process.env.LOGTAIL_SOURCE_TOKEN,
  'No Logtail Source Token defined'
)

const logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN

const logger = isDevelopment
  ? winston.createLogger({
      level: 'info', // Log only info and above level messages (can be error, warn, info, verbose, debug, silly)
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
  : new Logtail(logtailSourceToken ?? '')

if (isDevelopment && 'add' in logger) {
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
