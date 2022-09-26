import pino from 'pino'
import path from 'path'

export default pino(
  { level: process.env.PINO_LOG_LEVEL || 'info' },
  pino.destination(`${path.dirname('')}/combined.log`)
)
