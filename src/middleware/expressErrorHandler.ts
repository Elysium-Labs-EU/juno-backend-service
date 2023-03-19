import type { NextFunction, Request, Response } from 'express'

// TODO: Check if we can use this to bubble up the error message and still having the error returned to the frontend.
// Express error handling middleware
export const expressErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error)
  if (res.headersSent) {
    return next(error)
  }
  // const statusCode = error.status || 500
  const statusCode = 500
  const errorMessage = error.message || 'Internal server error'
  res.status(statusCode).json({ success: false, data: errorMessage })
}
