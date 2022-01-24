const PORT = process.env.PORT || 5001
import http from 'http'
import application from './routes/app'

const server = http.createServer(application)
server.listen(PORT)
