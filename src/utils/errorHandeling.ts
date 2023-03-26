import type { GaxiosError } from 'gaxios'
import { Common } from 'googleapis'

export default function errorHandeling(err: unknown, functionName: string) {
  if ((err as GaxiosError).response) {
    const error = err as Common.GaxiosError
    if ('response' in error) {
      // Log the error to the console
      console.error(error.response)
    }
    // Throw the error
    throw error
  }
  // Throw a new error with the function name and original error message
  const errorMessage = `${functionName} returned an error: ${err}`
  const error = new Error(errorMessage) as Error & { status?: number }
  error.status = 500 // or any other appropriate status code
  // Return an error object with a status code and message
  const errorObject = {
    status: error.status,
    message: error.message,
  }
  // Throw the error and return the error object
  throw { error: errorObject, originalError: err }
}
