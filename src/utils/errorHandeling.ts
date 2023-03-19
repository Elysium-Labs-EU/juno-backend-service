import type { GaxiosError } from 'gaxios'
import { Common } from 'googleapis'

export default function errorHandeling(err: unknown, functionName: string) {
  if ((err as GaxiosError).response) {
    const error = err as Common.GaxiosError
    if ('response' in error) {
      // eslint-disable-next-line no-console
      console.error(error.response)
    }
    return error
  }
  return Error(`${functionName} returned an error: ${err}`)
}
