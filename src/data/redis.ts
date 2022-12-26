import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { createClient } from 'npm:redis'

import assertNonNullish from '../utils/assertNonNullish.ts'

const env = config({ safe: true })

const cloudRedis = () => {
  assertNonNullish(env.REDIS_USER, 'No Redis User defined')
  assertNonNullish(env.REDIS_PASS, 'No Redis Pass defined')
  assertNonNullish(env.REDIS_PORT, 'No Redis Port defined')

  return createClient({
    username: env.REDIS_USER,
    password: env.REDIS_PASS,
    socket: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
    },
    legacyMode: true,
  })
}

const initiateRedis = () => {
  const redisClient =
    env.NODE_ENV === 'development'
      ? createClient({
          legacyMode: true,
        })
      : cloudRedis()

  redisClient.connect().catch(console.error)
  return redisClient
}

export default initiateRedis
