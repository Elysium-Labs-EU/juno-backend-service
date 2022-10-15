import { createHash } from 'crypto'

/**
 * @function createHashState
 * @returns a hashed value of the secret, to be used to verify the user when acquiring the tokens
 */

export default function createHashState(secret: string) {
  const hashValue = createHash('sha256').update(secret).digest('hex')
  return hashValue
}
