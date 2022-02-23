import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import indexRoute from './index'

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(express.json())

app.use('/', indexRoute)

const swaggerDefinition = {
  info: {
    title: 'Juno API',
    version: '0.0.1',
    description:
      'This is a REST API application made with Express. It retrieves data from Gmail Api.',
    license: {
      name: 'Licensed under GNU General Public License v3.0',
      url: 'https://github.com/Elysium-Labs-EU/juno-backend/blob/main/LICENSE',
    },
    contact: {
      name: 'Robbert Tuerlings',
      url: 'https://robberttuerlings.online',
    },
  },
}

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./index.js', './doc/definitions.yaml'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

export default app
