import type { Response } from 'express'

export const responseMiddleware = (
  res: Response,
  statusCode: number,
  message: any
) => {
  return res.status(statusCode).json(message)
}
