import { createClient } from 'redis'

import assertNonNullish from '../utils/assertNonNullish'

const cloudRedis = () => {
  assertNonNullish(process.env.REDIS_USER, 'No Redis User defined')
  assertNonNullish(process.env.REDIS_PASS, 'No Redis Pass defined')
  assertNonNullish(process.env.REDIS_PORT, 'No Redis Port defined')

  return createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
    legacyMode: true,
  })
}

const initiateRedis = () => {
  const redisClient =
    process.env.NODE_ENV === 'development'
      ? createClient({
          legacyMode: true,
        })
      : cloudRedis()

  // eslint-disable-next-line no-console
  redisClient.connect().catch(console.error)
  return redisClient
}

export default initiateRedis
