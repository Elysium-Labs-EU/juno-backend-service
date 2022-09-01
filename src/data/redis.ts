import { createClient } from 'redis'
import assertNonNullish from '../utils/assertNonNullish'

const initiateRedis = () => {
  assertNonNullish(process.env.REDIS_PORT, 'No Redis Port defined')

  const redisClient =
    process.env.NODE_ENV === 'development'
      ? createClient({
          legacyMode: true,
        })
      : createClient({
          username: process.env.REDIS_USER,
          password: process.env.REDIS_PASS,
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          },
          legacyMode: true,
        })

  redisClient.connect().catch(console.error)
  return redisClient
}

export default initiateRedis
